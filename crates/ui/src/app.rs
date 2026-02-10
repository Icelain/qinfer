/// We derive Deserialize/Serialize so we can persist app state on shutdown.
#[derive(serde::Deserialize, serde::Serialize)]
#[serde(default)] // if we add new fields, give them default values when deserializing old state
pub struct TemplateApp {
    messages: Vec<ChatMessage>,
    input: String,
    system_prompt: String,
    model: String,
    temperature: f32,
    top_p: f32,
    max_tokens: u32,
    presence_penalty: f32,
    frequency_penalty: f32,
    stream: bool,
}

#[derive(serde::Deserialize, serde::Serialize, Clone, Copy, PartialEq, Eq)]
enum Role {
    System,
    User,
    Assistant,
}

#[derive(serde::Deserialize, serde::Serialize)]
struct ChatMessage {
    role: Role,
    content: String,
}

impl Default for TemplateApp {
    fn default() -> Self {
        Self {
            messages: Vec::new(),
            input: String::new(),
            system_prompt: "You are a helpful assistant.".to_owned(),
            model: "gpt-4.1-mini".to_owned(),
            temperature: 0.7,
            top_p: 1.0,
            max_tokens: 512,
            presence_penalty: 0.0,
            frequency_penalty: 0.0,
            stream: true,
        }
    }
}

impl TemplateApp {
    /// Called once before the first frame.
    pub fn new(cc: &eframe::CreationContext<'_>) -> Self {
        // This is also where you can customize the look and feel of egui using
        // `cc.egui_ctx.set_visuals` and `cc.egui_ctx.set_fonts`.

        // Load previous app state (if any).
        // Note that you must enable the `persistence` feature for this to work.
        if let Some(storage) = cc.storage {
            eframe::get_value(storage, eframe::APP_KEY).unwrap_or_default()
        } else {
            Default::default()
        }
    }

    fn push_message(&mut self, role: Role, content: impl Into<String>) {
        self.messages.push(ChatMessage {
            role,
            content: content.into(),
        });
    }

    fn ui_message(&self, ui: &mut egui::Ui, message: &ChatMessage) {
        let visuals = ui.visuals();
        let (bg, fg, label) = match message.role {
            Role::System => (
                visuals.widgets.inactive.bg_fill,
                visuals.widgets.inactive.fg_stroke.color,
                "System",
            ),
            Role::User => (visuals.widgets.active.bg_fill, visuals.text_color(), "You"),
            Role::Assistant => (
                visuals.widgets.hovered.bg_fill,
                visuals.text_color(),
                "Assistant",
            ),
        };

        let bubble = egui::Frame::new()
            .fill(bg)
            .corner_radius(egui::CornerRadius::same(8))
            .inner_margin(egui::Margin::symmetric(10, 8));

        bubble.show(ui, |ui| {
            ui.label(egui::RichText::new(label).color(fg).strong());
            ui.add_space(2.0);
            let text = if message.role == Role::System {
                egui::RichText::new(&message.content).color(fg).italics()
            } else {
                egui::RichText::new(&message.content).color(fg)
            };
            ui.label(text);
        });
    }

    fn settings_ui(&mut self, ui: &mut egui::Ui) {
        ui.heading("Settings");
        ui.add_space(8.0);
        ui.label("Model");
        ui.text_edit_singleline(&mut self.model);
        ui.add_space(8.0);
        ui.label("Sampling");
        ui.add(egui::Slider::new(&mut self.temperature, 0.0..=2.0).text("temperature"));
        ui.add(egui::Slider::new(&mut self.top_p, 0.0..=1.0).text("top_p"));
        ui.add_space(8.0);
        ui.label("Penalties");
        ui.add(
            egui::Slider::new(&mut self.presence_penalty, -2.0..=2.0).text("presence"),
        );
        ui.add(
            egui::Slider::new(&mut self.frequency_penalty, -2.0..=2.0).text("frequency"),
        );
        ui.add_space(8.0);
        ui.horizontal(|ui| {
            ui.label("Max tokens");
            ui.add(egui::DragValue::new(&mut self.max_tokens).range(1..=8192));
        });
        ui.checkbox(&mut self.stream, "Stream responses");
        ui.add_space(8.0);
        egui::CollapsingHeader::new("System prompt")
            .default_open(true)
            .show(ui, |ui| {
                ui.add(
                    egui::TextEdit::multiline(&mut self.system_prompt)
                        .desired_rows(6)
                        .hint_text("You are a helpful assistant..."),
                );
            });
    }
}

impl eframe::App for TemplateApp {
    /// Called by the framework to save state before shutdown.
    fn save(&mut self, storage: &mut dyn eframe::Storage) {
        eframe::set_value(storage, eframe::APP_KEY, self);
    }

    /// Called each time the UI needs repainting, which may be many times per second.
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        let is_narrow = ctx.available_rect().width() < 900.0;

        egui::TopBottomPanel::top("top_panel").show(ctx, |ui| {
            ui.add_space(4.0);
            ui.horizontal(|ui| {
                ui.heading("Qinfer Chat");
                ui.add_space(12.0);
                ui.label(egui::RichText::new("No backend connected").weak());
            });
            ui.add_space(4.0);
        });

        if !is_narrow {
            egui::SidePanel::right("settings_panel")
                .resizable(true)
                .default_width(280.0)
                .min_width(220.0)
                .max_width(360.0)
                .show(ctx, |ui| {
                    self.settings_ui(ui);
                });
        }

        egui::TopBottomPanel::bottom("composer_panel")
            .resizable(false)
            .show(ctx, |ui| {
                ui.add_space(6.0);
                ui.label("Message");
                let desired_rows = if is_narrow { 2 } else { 3 };
                ui.add(
                    egui::TextEdit::multiline(&mut self.input)
                        .desired_rows(desired_rows)
                        .desired_width(ui.available_width())
                        .hint_text("Ask a question, paste a prompt, or describe a task..."),
                );
                ui.add_space(6.0);
                ui.horizontal(|ui| {
                    let can_send = !self.input.trim().is_empty();
                    if ui.add_enabled(can_send, egui::Button::new("Send")).clicked() {
                        let user_message = self.input.trim().to_owned();
                        self.input.clear();
                        self.push_message(Role::User, user_message);
                        self.push_message(
                            Role::Assistant,
                            "Awaiting inference. Wire a backend to replace this placeholder.",
                        );
                    }
                    if ui.button("Clear chat").clicked() {
                        self.messages.clear();
                    }
                    if ui.button("Seed demo").clicked() {
                        let system_prompt = self.system_prompt.clone();
                        self.messages.clear();
                        self.push_message(Role::System, system_prompt);
                        self.push_message(
                            Role::User,
                            "Summarize our weekly goals and turn them into a checklist.",
                        );
                        self.push_message(
                            Role::Assistant,
                            "Sure. I will generate a concise summary and a checklist for review.",
                        );
                    }
                });
                ui.add_space(4.0);
            });

        egui::CentralPanel::default().show(ctx, |ui| {
            ui.add_space(8.0);
            if is_narrow {
                egui::CollapsingHeader::new("Settings")
                    .default_open(false)
                    .show(ui, |ui| {
                        self.settings_ui(ui);
                    });
                ui.add_space(8.0);
            }
            ui.heading("Conversation");
            ui.add_space(6.0);

            egui::ScrollArea::vertical()
                .auto_shrink([false; 2])
                .stick_to_bottom(true)
                .show(ui, |ui| {
                    if self.messages.is_empty() {
                        ui.label(egui::RichText::new("No messages yet.").weak());
                        ui.label(
                            egui::RichText::new("Compose a prompt below to start the chat.")
                                .weak(),
                        );
                    } else {
                        for message in &self.messages {
                            self.ui_message(ui, message);
                            ui.add_space(8.0);
                        }
                    }
                });
        });
    }
}
