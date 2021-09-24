import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TextboxService, MessageType } from '@app/services/textbox.service';

const messageMap = new Map<string, string>(
    [
        [MessageType.System, 'Système :'],
        [MessageType.User, 'Utilisateur :'],
    ]
);

@Component({
    selector: 'app-textbox',
    templateUrl: './textbox.component.html',
    styleUrls: ['./textbox.component.scss'],
})

export class TextboxComponent implements OnDestroy {
    messages: { style: string, text: string }[] = [];
    subscription: Subscription;

    constructor(private textboxService: TextboxService) {
        this.subscription = this.textboxService.getMessage().subscribe((message) => {
            if (message) {
                this.messages.push(message);
                setTimeout(() => {
                    document.getElementById('thread')?.scrollTo(0, document.getElementById('thread')?.scrollHeight ?? 1);
                }, 100);
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getMessage(message: { style: string, text: string }) {
        return `${messageMap.get(message.style)} ${message.text}`
    }
}
