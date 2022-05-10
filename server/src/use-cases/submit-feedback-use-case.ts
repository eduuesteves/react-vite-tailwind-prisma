// Camada de Aplicação
// Regra de negócio da aplicação

import { MailAdapter } from "../adaptors/mail-adaptors";
import { FeedbacksRepository } from "../repositories/feedbacks-repositories";

interface SubmitFeedbackUseCaseRequest {
    type: string;
    comment: string;
    screenshot?: string;
}

export class SubmitFeedbackUseCase {
    constructor(
        private feedbacksRepository: FeedbacksRepository,
        private mailAdapter: MailAdapter
    ) {}


    // Aqui que cria o feedback
    async execute(request: SubmitFeedbackUseCaseRequest) {
        const { type, comment, screenshot } = request;

        if(!type) {
            throw new Error("Type is required.");
        }

        if(!comment) {
            throw new Error("Comment is required.");
        }

        if(screenshot && !screenshot.startsWith("data:image/png;base64")) {
            throw new Error("Invalid screenshot format.")
        }

        await this.feedbacksRepository.create({
            type,
            comment,
            screenshot
        });

        await this.mailAdapter.sendMail({
            subject: "Novo feedback",
            body: [
                `<div style="font-family: sans-serif; font-size: 16px; color: #222">`,
                `<p>Tipo do feedback: ${type}</p>`,
                `<p>Comentário: ${comment}</p>`,
                `</div>`
            ].join("\n")
        });
    }
}