import { HighlightDirective } from './highlight.directive';
import { ElementRef } from '@angular/core';

describe('HighlightDirective', () => {
  it('should create an instance', () => {
    const mockEl = new ElementRef(document.createElement('div'));
    const directive = new HighlightDirective(mockEl);
    expect(directive).toBeTruthy();
  });
});
