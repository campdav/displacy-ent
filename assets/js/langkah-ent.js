//- ----------------------------------
//- LANGKAH ENT
//- ----------------------------------

'use strict';

class LangkahENT {
    constructor (api, options) {
        this.api = api;
        this.container = document.querySelector(options.container || '#langkah');

        this.defaultText = options.defaultText || 'La souris est mangée par le chat. \n Le chat est gourmand';
        this.defaultModel = options.defaultModel || 'fr';
        this.defaultEnts = options.defaultEnts || ['repetition', 'terne'];

        this.onStart = options.onStart || false;
        this.onSuccess = options.onSuccess || false;
        this.onError = options.onError || false;
        this.onRender = options.onRender || false;

    }

    parse(text = this.defaultText, model = this.defaultModel, ents = this.defaultEnts) {
        if(typeof this.onStart === 'function') this.onStart();

        let xhr = new XMLHttpRequest();
        xhr.open('POST', this.api, true);
        xhr.setRequestHeader('Content-type', 'text/plain');
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200) {
                if(typeof this.onSuccess === 'function') this.onSuccess();
                this.render(text, JSON.parse(xhr.responseText), ents);
            }

            else if(xhr.status !== 200) {
                if(typeof this.onError === 'function') this.onError(xhr.statusText);
            }
        }

        xhr.onerror = () => {
            xhr.abort();
            if(typeof this.onError === 'function') this.onError();
        }

        xhr.send(JSON.stringify({ text, model }));
    }

    render(text, spans, ents) {
        this.container.innerHTML = '';
        let offset = 0;

        spans.forEach(({ type, start, end }) => {
            const entity = text.slice(start, end);
            const fragments = text.slice(offset, start).split('\n');

            fragments.forEach((fragment, i) => {
                this.container.appendChild(document.createTextNode(fragment));
                if(fragments.length > 1 && i != fragments.length - 1) this.container.appendChild(document.createElement('br'));
            });

            if(ents.includes(type.toLowerCase())) {
                const mark = document.createElement('mark');
                mark.setAttribute('data-entity', type.toLowerCase());
                mark.appendChild(document.createTextNode(entity));
                this.container.appendChild(mark);
            }

            else {
                this.container.appendChild(document.createTextNode(entity));
            }

            offset = end;
        });

        this.container.appendChild(document.createTextNode(text.slice(offset, text.length)));

        console.log(`%c💥  HTML markup\n%c<div class="entities">${this.container.innerHTML}</div>`, 'font: bold 16px/2 arial, sans-serif', 'font: 13px/1.5 Consolas, "Andale Mono", Menlo, Monaco, Courier, monospace');

        if(typeof this.onRender === 'function') this.onRender();
    }
}
