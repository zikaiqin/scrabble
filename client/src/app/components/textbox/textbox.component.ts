import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TextboxService } from '@app/services/textbox.service';

@Component({
    selector: 'app-textbox',
    templateUrl: './textbox.component.html',
    styleUrls: ['./textbox.component.scss'],
})
export class TextboxComponent implements OnDestroy {
    messages: any[] = [];
    subscription: Subscription;

    constructor(private textboxService: TextboxService) {
        this.subscription = this.textboxService.getMessage().subscribe(message => {
            if(message) {
                this.messages.push(message); 
                setTimeout(() => {
                    document.getElementById('thread')?.scrollTo(0, document.getElementById('thread')?.scrollHeight??1);
                }, 100);  
            }
        });
    }

    ngOnDestroy(){
        this.subscription.unsubscribe();
    }
}