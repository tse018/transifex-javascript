import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { UTComponent } from '../src/lib/UT.component';
import { SafeHtmlPipe, TranslationService, TXInstanceComponent } from '../src/public-api';

describe('UTComponent', () => {
  let component: UTComponent;
  let fixture: ComponentFixture<UTComponent>;
  let service: TranslationService;
  const translationParams = {
    _key: '',
    _context: '',
    _comment: '',
    _charlimit: 0,
    _tags: '',
    _escapeVars: true,
    _inline: false,
    sanitize: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UTComponent, SafeHtmlPipe, TXInstanceComponent],
      providers: [TXInstanceComponent],
    })
      .compileComponents();
    service = TestBed.inject(TranslationService);
    jest.spyOn(service, 'setCurrentLocale');
    jest.spyOn(service, 'getCurrentLocale').mockReturnValue('en');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    // setup
    jest.spyOn(component, 'translate');
    const localeChangedSpy = jest.spyOn(component, 'localeChanged', 'get')
      .mockReturnValue(of('el'));

    // act
    component.ngOnInit();
    fixture.detectChanges();

    // assert
    expect(component).toBeTruthy();
    expect(service).toBeTruthy();
    expect(component.localeChanged).toBeTruthy();
    expect(component.translate).toHaveBeenCalled();
    expect(component.onLocaleChange).toBeTruthy();
    //expect(localeChangedSpy.call.any()).toEqual(true);
      expect(localeChangedSpy).toHaveBeenCalled(); // Updated assertion

  });

  it('should translate string', () => {
    // setup
    jest.spyOn(service, 'translate').mockReturnValue('translated');

    // act
    component.str = 'not-translated';
    component.ngOnInit();
    fixture.detectChanges();

    // assert
    expect(service.translate).toHaveBeenCalledWith('not-translated',
      { ...translationParams }, '');
    expect(component.translatedStr).toEqual('translated');
  });

  it('should translate string with key', () => {
    // setup
    jest.spyOn(service, 'translate').mockReturnValue('translated');

    // act
    component.str = 'not-translated';
    component.key = 'key-not-translated';
    component.ngOnInit();
    fixture.detectChanges();

    // assert
    expect(service.translate).toHaveBeenCalledWith('not-translated',
      { ...translationParams, _key: 'key-not-translated' }, '');
    expect(component.translatedStr).toEqual('translated');
  });

  it('should translate and sanitize the string using div as wrapper',
    () => {
      // setup
      jest.spyOn(service, 'translate').mockReturnValue('<a>translated</a>');

      // act
      component.str = '<a>not-translated</a>';
      component.ngOnInit();
      fixture.detectChanges();

      // assert
      expect(service.translate).toHaveBeenCalledWith('<a>not-translated</a>',
        { ...translationParams, _inline: false }, '');
      const compiled = fixture.debugElement.nativeElement;
      expect((compiled as HTMLDivElement).innerHTML)
        .toContain('<div><a>translated</a></div>');
    });

  it('should translate and sanitize the string using span as wrapper',
    () => {
      // setup
      jest.spyOn(service, 'translate').mockReturnValue('<a>translated</a>');

      // act
      component.str = '<a>not-translated</a>';
      component.inline = true;
      component.ngOnInit();
      fixture.detectChanges();

      // assert
      expect(service.translate).toHaveBeenCalledWith('<a>not-translated</a>',
        { ...translationParams, _inline: true }, '');
      const compiled = fixture.debugElement.nativeElement;
      expect((compiled as HTMLDivElement).innerHTML)
        .toContain('<span><a>translated</a></span>');
    });
});
