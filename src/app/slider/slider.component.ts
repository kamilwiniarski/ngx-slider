import {
  Component, OnInit, Input, HostListener, ElementRef, AfterViewInit, ViewChild, Renderer2, ViewChildren, QueryList } from '@angular/core';
import { Slide, BreakPoint } from './slider-interfaces';

// enum KEY_CODE {
//   ARROW_LEFT = 37,
//   ARROW_RIGHT = 39
// }

@Component({
  selector: 'ngx-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, AfterViewInit {

  @Input() slides: Slide[];
  @Input() breakPoints: BreakPoint[];
  @Input() backgroundImage: string; // = 'https://picsum.photos/1920/1080/?random';
  @Input() infiniteSlider = false;
  @Input() showDots = true;
  @Input() singleItemSlide = true;


  currentSlide: number;
  columns: number;

  @ViewChild('slider') sliderRef: ElementRef;
  @ViewChildren('slideItem') slidesList: QueryList<any>;

  @HostListener('window:resize')
  onResize() {
    this.columns = this.setColumns(this.sliderRef.nativeElement.clientWidth, this.columns, this.breakPoints);
    this.reRenderColumns(this.columns, this.slidesList.toArray());
  }

  // @HostListener('window:keydown', ['$event'])
  // keyEvent(event: KeyboardEvent) {
  //   this.onKeyPress(event);
  // }

  constructor(private renderer: Renderer2) { } // private element: ElementRef

  ngOnInit() {
  this.slides = [
      {
      backgroundImage: 'https://picsum.photos/200/300/?image=0',
      innerHTML: '<div class="ziemniak">Ziemniak1</div>'
    },
    {
      backgroundImage: 'https://picsum.photos/200/300/?image=23',
      innerHTML: '<div>Ziemniak2</div>'
    },
    {
      backgroundImage: 'https://picsum.photos/200/300/?image=41',
      innerHTML: '<div>Ziemniak3</div>'
    },
    {
      backgroundImage: 'https://picsum.photos/200/300/?image=1',
      innerHTML: '<div>Ziemniak4</div>'
    },
    {
      backgroundImage: 'https://picsum.photos/200/300/?image=78',
      innerHTML: '<div>Ziemniak5</div>'
    },
    {
      backgroundImage: 'https://picsum.photos/200/300/?image=66',
      innerHTML: '<div>Ziemniak6</div>'
    },
    // {
    //   backgroundImage: 'https://picsum.photos/200/300/?image=23',
    //   innerHTML: '<div>Ziemniak2</div>'
    // },
    // {
    //   backgroundImage: 'https://picsum.photos/200/300/?image=23',
    //   innerHTML: '<div>Ziemniak2</div>'
    // }
  ];
  this.breakPoints = [
    {
      columns: 3,
      minWidth: 992
    },
    {
      columns: 1,
      minWidth: 0
    },
    {
      columns: 2,
      minWidth: 768
    }
  ];
  this.breakPoints = this.sortBreakpoints(this.breakPoints);
  this.currentSlide = 0;
  this.columns = this.setColumns(this.sliderRef.nativeElement.clientWidth, this.columns, this.breakPoints);
  }

  ngAfterViewInit(): void {
    this.reRenderColumns(this.columns, this.slidesList.toArray());
    if (this.infiniteSlider) {
      this.setOrder(0, this.columns);
    }
  }

  nextSlide(): void {
    if (this.infiniteSlider ||
      (this.singleItemSlide && this.slides.length > this.currentSlide + this.columns ) ||
      (!this.singleItemSlide && this.slides.length > (this.currentSlide + 1) * this.columns)) {
        this.slide(1);
    }
  }

  previousSlide(): void {
    if (this.infiniteSlider || this.currentSlide > 0) {
        this.slide(-1);
    }
  }

  onSwipe(event: any): void {
    if (event.deltaX > 0) {
      this.slide(-1);
    } else if (event.deltaX < 0) {
      this.slide(1);
    }
  }

  goToSlide(idx: number): void {
    this.slide(idx - this.currentSlide);
  }

  private setColumns(width: number, columns: number, breakPoints: BreakPoint[]): number {
    for (const breakPoint of breakPoints) {
      if (width > breakPoint.minWidth && columns !== breakPoint.columns ) {
        if (columns && columns < breakPoint.columns && !this.infiniteSlider &&
          ((this.singleItemSlide && this.slides.length === this.currentSlide + columns ) ||
          (!this.singleItemSlide && this.slides.length === (this.currentSlide + 1) * columns) ) ) {
          this.slide(columns - breakPoint.columns);
        }
        return breakPoint.columns;
      } else if (width > breakPoint.minWidth && columns === breakPoint.columns) {
        return columns;
      }
    }
  }

  private reRenderColumns(columns: number, slides: any[]) {
    for (const slide of slides) {
      this.renderer.setStyle(slide.nativeElement, 'flex', `1 0 calc(100% / ${columns})`);
    }
  }

  // onKeyPress(event: KeyboardEvent): void {
  //   if (event.keyCode === KEY_CODE.ARROW_LEFT) {
  //     event.preventDefault();
  //     this.previousSlide();
  //   } else if (event.keyCode === KEY_CODE.ARROW_RIGHT) {
  //     event.preventDefault();
  //     this.nextSlide();
  //   }
  // }

  private slide(change: number): void {
      this.currentSlide += change;
      if (this.infiniteSlider) {
      this.translateItems(change);
      setTimeout(() => {
        this.setOrder(change, this.columns);
      }, 400);
    } else {
      this.slideFinite( this.currentSlide, this.singleItemSlide, this.columns );
    }
  }

  private setOrder(change: number, columns: number) {
    const slidesList = this.slidesList.toArray();
    if (change === 0) {
      slidesList.forEach((item, idx) => {
        const itemStyle = item.nativeElement.style;
            const newOrder = idx < slidesList.length - 1 ? idx : -1 ;
            this.renderer.setStyle(item.nativeElement, 'order', newOrder);
            const itemMargin = itemStyle.order < 0 ? `${-100 / columns}%` : `0`;
            this.renderer.setStyle(item.nativeElement, 'margin-left', itemMargin);
            this.renderer.setStyle(item.nativeElement, 'transition', 'none');
            this.renderer.setStyle(item.nativeElement, 'transform', `translateX(0%)`);
            console.log(item.nativeElement.style.order);
    });
   } else if ( change > 0) {
      slidesList.forEach((item) => {
        const itemStyle = item.nativeElement.style;
        const newOrder = +itemStyle.order < 0 ? slidesList.length - 2 : +itemStyle.order - 1;
        this.renderer.setStyle(item.nativeElement, 'order', newOrder);
        console.log (itemStyle.order);
        const itemMargin = itemStyle.order < 0 ? `${-100 / columns}%` : `0`;
        this.renderer.setStyle(item.nativeElement, 'margin-left', itemMargin);
        this.renderer.setStyle(item.nativeElement, 'transition', 'none');
        this.renderer.setStyle(item.nativeElement, 'transform', `translateX(0%)`);
        console.log(item.nativeElement.style.order);
    });
  } else if ( change < 0) {
    slidesList.forEach((item) => {
      const itemStyle = item.nativeElement.style;
      const newOrder = +itemStyle.order < slidesList.length - 2 ? +itemStyle.order + 1 : - 1;
      this.renderer.setStyle(item.nativeElement, 'order', newOrder);
      const itemMargin = itemStyle.order < 0 ? `${-100 / columns}%` : `0`;
      this.renderer.setStyle(item.nativeElement, 'margin-left', itemMargin);
      this.renderer.setStyle(item.nativeElement, 'transition', 'none');
      this.renderer.setStyle(item.nativeElement, 'transform', `translateX(0%)`);
      console.log(item.nativeElement.style.order);
  });
}
      console.log('------');
  }

  private translateItems(change: number) {
    this.slidesList.toArray().forEach(item => {
          this.renderer.setStyle(item.nativeElement, 'transition', 'transform 300ms ease-in-out');
          this.renderer.setStyle(item.nativeElement, 'transform', `translateX(${-change}00%)`);
    });
  }


  private sortBreakpoints (breakPoints: BreakPoint[]): BreakPoint[] {
    breakPoints.sort((first, second) => {
      return second.minWidth - first.minWidth;
    });
    return breakPoints;
  }

  private slideFinite(currentSlide: number, singleSlide: boolean, columns: number) {
    if (singleSlide) {
      this.slidesList.toArray().forEach(item => {
      this.renderer.setStyle(item.nativeElement, 'transform', `translateX(-${currentSlide}00%)`);
  });
    } else {
      this.slidesList.toArray().forEach(item => {
      this.renderer.setStyle(item.nativeElement, 'transform', `translateX(-${currentSlide * columns}00%)`);
  });
    }
  }
}

