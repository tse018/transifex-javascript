import {Component} from "@angular/core";
import {T} from "../src/lib/T.decorator";

@Component({
    template: '<div>{{ testProperty }}</div>',
})
export class TestComponent {
    @T('not-trans-dec', { _key: 'test' }) testProperty!: string;
}

@Component({
    template: '<div>{{ testProperty }}</div>',
})
export class TestWithInstanceComponent {
    @T('not-trans-dec', { _key: 'test' }, {alias: 'alias', controlled: true, token: ''} ) testProperty!: string;
}
