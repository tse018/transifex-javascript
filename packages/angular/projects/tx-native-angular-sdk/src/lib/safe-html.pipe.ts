import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * A pipe for sanitizing safely HTML
 */
@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
