import { CurrencyPipe, getLocaleCurrencyCode, getLocaleCurrencySymbol } from '@angular/common';
import { Directive, ElementRef, forwardRef, HostListener, Inject, LOCALE_ID, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
    selector: '[currencyInput][ngModel]',  
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CurrencyInputDirective), multi: true },
    ]
})
export class CurrencyInputDirective implements ControlValueAccessor {
    onChange = (value: number) => {};
    onTouch = () => {};
    readonly CURRENCY_SYMBOL: string;
    readonly CURRENCY_CODE: string;
    readonly INVALID_CHARACTERS: RegExp;

    constructor(
        @Inject(LOCALE_ID) protected locale: string,
        protected renderer: Renderer2,
        protected elementRef: ElementRef,
        protected currencyPipe: CurrencyPipe,
    ) {
        this.CURRENCY_SYMBOL = getLocaleCurrencySymbol(this.locale) || '$';
        this.CURRENCY_CODE = getLocaleCurrencyCode(this.locale);
        this.INVALID_CHARACTERS = /[^\d\.-]/;
    }

    @HostListener('keypress', ['$event']) 
    protected onKeyPress(event: KeyboardEvent) 
    {
        this.restrictInput(event)
    }

    @HostListener('focus', ['$event']) 
    protected onFocus(event: FocusEvent) 
    {
        this.cleanOnFocus(event);
    }

    @HostListener('blur', ['$event']) 
    protected onBlur(event: FocusEvent) 
    {
        this.formatOnBlur(event);
    }

    @HostListener('input', ['$event.target.value'])
    input(value: string) 
    {
        this.onChange(this.parse(value));
    }

    // When this directive is applied to an element which also implements matInput, onTouch() is not being called for some reason.
    // Even though we register it successfully below.  This causes input validation issues, ie. <mat-error> doesn't show pop up with
    // any existing errors.  Feel like this is hacky but have tried many different methods of getting this working.  This solution has 
    // less overhead than the others.
    @HostListener('focusout', ['$event.target'])
    onFocusout() 
    {
        this.onTouch();
    }

    // equivalent to ng1 $formatters
    writeValue(value: number): void 
    {
        this.format(value);
    }

    // equivalent to ng1 $parsers
    registerOnChange(fn: () => void): void 
    {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void 
    {
        this.onTouch = fn;
    }

    protected restrictInput(event: KeyboardEvent) 
    {
        let key: string = event.key;
        let value: string = (<HTMLInputElement>event.target).value;
        let selectionStart: number = (<HTMLInputElement>event.target).selectionStart;

        // Prevent input of invalid characters
        if (!! this.INVALID_CHARACTERS.test(key) )
        {
            event.preventDefault();
            return;
        }

        // Prevent input of additional decimals
        if ( key == '.' && value.includes('.') )
        {
            event.preventDefault();
            return;
        }
        
        // Prevent input of additional or non-leading minus symbols
        if ( key == '-' && (value.includes('-') || selectionStart > 0) )
        {
            event.preventDefault();
            return;
        }
    }

    protected cleanOnFocus(event: FocusEvent) 
    {
        const element: HTMLInputElement = this.elementRef.nativeElement;
        const eventValue: string = (<HTMLInputElement>event.target).value;
        const cleanedValue: string = this.cleanViewValue(eventValue);

        this.renderer.setProperty(element, 'value', cleanedValue);
    }

    protected formatOnBlur(event: FocusEvent) 
    {
        const eventValue: string = (<HTMLInputElement>event.target).value;

        if (eventValue != null && eventValue != undefined) 
        {
            const transformedValue: string = this.currencyPipe.transform(eventValue);
            this.renderer.setProperty(this.elementRef.nativeElement, 'value', transformedValue);
        }
    }

    protected cleanViewValue(value: string): string 
    {
        const globalRegExp: RegExp = new RegExp(this.INVALID_CHARACTERS, 'g');

        return value.replace(globalRegExp, '');
    }

    protected parse(value: string): number 
    {
        const cleanedValue: string = this.cleanViewValue(value);
        const parsedValue: number = parseFloat(cleanedValue);
        const roundedValue: number = Math.round(parsedValue * 100 + Number.EPSILON ) / 100;
        const roundedIntValue: number = Math.round(roundedValue * 100);

        return isNaN(roundedIntValue)
            ? null
            : roundedIntValue
    }

    protected format(value: number): void 
    {
        const element: HTMLInputElement = this.elementRef.nativeElement;
        const formattedValue: string = this.currencyPipe.transform(value / 100, this.CURRENCY_CODE) 
        this.renderer.setProperty(element, 'value', formattedValue);
    }
}
