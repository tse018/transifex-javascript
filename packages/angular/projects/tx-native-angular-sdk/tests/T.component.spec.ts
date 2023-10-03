import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { tx } from '@transifex/native';

import { TComponent } from '../src/lib/T.component';
import { SafeHtmlPipe, TranslationService, TXInstanceComponent } from '../src/public-api';


describe('TComponent', () => {
  let localeChangedSubject: ReplaySubject<string>;

  let component: TComponent;
  let fixture: ComponentFixture<TComponent>;
  let service: TranslationService;
  let instance: TXInstanceComponent;
  let localeChangedSpy;

  const translationParams = {
    _key: '',
    _context: '',
    _comment: '',
    _charlimit: 0,
    _tags: '',
    _escapeVars: false,
    _inline: false,
    sanitize: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TComponent, SafeHtmlPipe, TXInstanceComponent],
      providers: [TXInstanceComponent],
    })
        .compileComponents();

    localeChangedSubject = new ReplaySubject<string>(0);

    service = TestBed.inject(TranslationService);
    instance = TestBed.inject(TXInstanceComponent);

    jest.spyOn(service, 'getCurrentLocale').mockReturnValue('en');
    localeChangedSpy = jest.spyOn(service, 'localeChanged', 'get').mockReturnValue(localeChangedSubject);
    jest.spyOn(service, 'setCurrentLocale').mockImplementation(async (locale) => {
      localeChangedSubject.next(locale);
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', async () => {
    // setup
    jest.spyOn(component, 'translate');
    localeChangedSpy = jest.spyOn(component, 'localeChanged', 'get')
      .mockReturnValue(localeChangedSubject);

    // act
    component.ngOnInit();
    await service.fetchTranslations('nb');
    fixture.detectChanges();

    // assert
    expect(component).toBeTruthy();
    expect(service).toBeTruthy();
    expect(component.localeChanged).toBeTruthy();
    expect(component.translate).toHaveBeenCalled();
    expect(component.onLocaleChange).toBeTruthy();
    expect(component.onTranslationsFetch).toBeTruthy();
    expect(localeChangedSpy).toHaveBeenCalled();
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

  it('should translate string without vars', () => {
    // setup
    jest.spyOn(service, 'translate').mockReturnValue('translated');

    // act
    component.str = 'not-translated';
    component.vars = {};
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

  it('should translate and not sanitize the string', () => {
    // setup
    jest.spyOn(service, 'translate').mockReturnValue('<a>translated</a>');

    // act
    component.str = '<a>not-translated</a>';
    component.ngOnInit();
    fixture.detectChanges();

    // assert
    const compiled = fixture.debugElement.nativeElement;
    expect((compiled as HTMLDivElement).innerHTML)
      .toContain('&lt;a&gt;translated&lt;/a&gt;');
  });

  it('should translate and sanitize the string', () => {
    // setup
    jest.spyOn(service, 'translate').mockReturnValue('<a>translated</a>');

    // act
    component.str = '<a>not-translated</a>';
    component.sanitize = true;
    component.ngOnInit();
    fixture.detectChanges();

    // assert
    const compiled = fixture.debugElement.nativeElement;
    expect((compiled as HTMLDivElement).innerHTML)
      .toContain('<span><a>translated</a></span>');
  });

  it('should detect input parameters change and translate', () => {
    // setup
    jest.spyOn(service, 'translate').mockReturnValue('<a>translated</a>');
    jest.spyOn(tx, 'translate');

    // act
    service.translate('test', { ...translationParams });
    component.str = 'other-value';
    component.ngOnChanges()
    fixture.detectChanges();

    // assert
    expect(service.translate).toHaveBeenCalled();
    const compiled = fixture.debugElement.nativeElement;
    expect((compiled as HTMLDivElement).innerHTML)
      .toContain('&lt;a&gt;translated&lt;/a&gt;');
  });

  it('should detect localeChange and translate', async () => {
    // act
    component.str = 'not-translated';
    component.key = 'key-not-translated';
    component.ngOnInit();
    fixture.detectChanges();

    // change
    jest.spyOn(service, 'translate').mockReturnValue('translated-again');

    await service.setCurrentLocale('nb');

    fixture.detectChanges();

    // assert
    expect(service.translate).toHaveBeenCalledWith('not-translated',
      { ...translationParams, _key: 'key-not-translated' }, '');
    expect(component.translatedStr).toEqual('translated-again');
  });

  it('should respect changes to input params', async () => {
    // setup
    jest.spyOn(service, 'translate').mockReturnValue('translated');

    // act
    component.str = 'not-translated';
    component.key = 'key-not-translated';
    component.ngOnInit();
    fixture.detectChanges();

    component.context = 'late';
    component.ngOnChanges();
    fixture.detectChanges();

    // assert
    expect(service.translate).toHaveBeenCalledWith('not-translated', {
      ...translationParams,
      _key: 'key-not-translated',
      _context: 'late',
    }, '');
    expect(component.translatedStr).toEqual('translated');
  });

  it('should translate string with an alternative instance', () => {
    // setup
    instance.token = 'instance-token';
    instance.alias = 'instance-alias';
    jest.spyOn(service, 'translate').mockReturnValue('translated');

    // act
    component.str = 'not-translated';
    component.ngOnInit();
    fixture.detectChanges();

    // assert
    expect(service.translate).toHaveBeenCalledWith('not-translated',
      { ...translationParams }, 'instance-alias');
    expect(component.translatedStr).toEqual('translated');
  });

  it('should detect translationsFetched', async () => {
    // setup
    jest.spyOn(service, 'translate').mockReturnValue('translated');

    // act
    component.str = 'not-translated';
    component.ngOnInit();
    fixture.detectChanges();

    // change
    await service.fetchTranslations('tag1');
    fixture.detectChanges();

    // assert
    expect(service.translate).toHaveBeenCalled();
  });

  it('should detect translationsFetched using alternative instance',
    async () => {
      // setup
      instance.token = 'instance-token';
      instance.alias = 'instance-alias';
      jest.spyOn(service, 'translate').mockReturnValue('translated');

      // act
      component.str = 'not-translated';
      component.ngOnInit();
      fixture.detectChanges();

      // change
      await service.fetchTranslations('tag1');
      fixture.detectChanges();

      // assert
      expect(service.translate).toHaveBeenCalledWith('not-translated',
        { ...translationParams }, 'instance-alias');
    });
});
