import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Directive({
  selector: '[ngxThrottleEvent]'
})
export class ThrottleEventDirective implements OnInit, OnDestroy {

  @Input() throttleTime: number;
  @Output() throttleEvent = new EventEmitter();
  private actions = new Subject();
  private subscription: Subscription;

  constructor() { }

  ngOnInit() {
    this.subscription = this.actions.pipe(
      throttleTime(this.throttleTime)
    ).subscribe(event => this.throttleEvent.emit(event));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.actions.next(event);
  }

  @HostListener('swipe', ['$event'])
  swipeEvent(event) {
    event.preventDefault();
    event.srcEvent.stopImmediatePropagation();
    this.actions.next(event);
  }
}
