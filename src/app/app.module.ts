import { NgModule } from '@angular/core';
import * as Hammer from 'hammerjs';
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SliderComponent } from './slider/slider.component';
import { ThrottleEventDirective } from './slider/throttle-event.directive';

export class HammerConfig extends HammerGestureConfig  {
  buildHammer(element: HTMLElement) {
    const mc = new Hammer(element, {
      touchAction: 'pan-y'
    });
    return mc;
  }
}

@NgModule({
  declarations: [
    AppComponent,
    SliderComponent,
    ThrottleEventDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG,
    useClass: HammerConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
