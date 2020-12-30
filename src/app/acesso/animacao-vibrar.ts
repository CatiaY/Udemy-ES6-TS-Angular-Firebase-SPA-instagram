import { style, animate, keyframes, animation } from '@angular/animations';

export const vibrarAnimation = animation([
    animate
    ('1000ms ease-in',
        keyframes([
            style({transform: 'translate3d(-1px, 0, 0)', offset: 0.1}),
            style({transform: 'translate3d(2px, 0, 0)', offset: 0.2}),
            style({transform: 'translate3d(-5px, 0, 0)', offset: 0.3}),
            style({transform: 'translate3d(5px, 0, 0)', offset: 0.4}),
            style({transform: 'translate3d(-5px, 0, 0)', offset: 0.5}),
            style({transform: 'translate3d(5px, 0, 0)', offset: 0.6}),
            style({transform: 'translate3d(-5px, 0, 0)', offset: 0.7}),
            style({transform: 'translate3d(2px, 0, 0)', offset: 0.8}),
            style({transform: 'translate3d(-1px, 0, 0)', offset: 0.9})          
        ])
    ) 
])

export class AnimacaoVibrar {
    
    static vibrarAnimacao(vibrar: string): string {
        return vibrar === 'vibrar-inicio' ? 'vibrar-fim' : 'vibrar-inicio'
    }
}