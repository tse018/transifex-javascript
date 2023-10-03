import { TestBed } from '@angular/core/testing';
import * as transifexNative from '@transifex/native';
import {TestComponent, TestWithInstanceComponent} from './test.component';
import {TranslationService} from "../src/lib/translation.service";

describe('T Decorator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ teardown: { destroyAfterEach: false },
    });
  });

  beforeEach(() => {
    jest.spyOn(transifexNative, 'tx').mockReturnValue('ok-translated-dec');
  });

  it('should test the decorator T', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const component = fixture.componentInstance;

    const s = TestBed.inject(TranslationService);

    const jestSpy = jest.spyOn(s, 'translate');

    fixture.detectChanges();

      expect(jestSpy).toHaveBeenCalled();
      expect(jestSpy).toHaveBeenCalledWith('not-trans-dec', { _key: 'test' });
      expect(component.testProperty).toBe('ok-translated-dec');

      const compiled: HTMLElement = fixture.debugElement.nativeElement;
      expect(compiled.innerHTML).toContain('ok-translated-dec');

  });

  it('should test the decorator T with an instance', () => {
    jest.spyOn(tx, 'translate').mockReturnValue('ok-translated-dec')

    const fixtureWithInstance = TestBed.createComponent(TestWithInstanceComponent);
    const component = fixtureWithInstance.componentInstance;

    fixtureWithInstance.detectChanges();
    expect(tx.translate).toHaveBeenCalled();
    expect(tx.translate).toHaveBeenCalledWith('not-trans-dec', { _key: 'test' });
    expect(component.testProperty).toBe('ok-translated-dec');

    const compiled: HTMLElement = fixtureWithInstance.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain('ok-translated-dec');
  });
});
