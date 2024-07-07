import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
    selector: '[gosiDragDrop]'
  })
  export class DragDropDirective {
    // fileDropped: any;
    @Output() fileDropped:EventEmitter<any>=new EventEmitter();
    constructor() {}
// dragover listener
@HostListener('dragover',['$event']) onDragOver(evt){
    evt.preventDefault();
    evt.stopPropagation();
}
// dragleave listener
@HostListener('dragleave',['$event']) public onDragLeave(evt){
    evt.preventDefault();
    evt.stopPropagation();
}
// drop listener
@HostListener('drop',['$event']) public ondrop(evt){
    evt.preventDefault();
    evt.stopPropagation();
    const files=evt.dataTransfer.files;
    if(files.length > 0){
        // emit the dragged file from here
        this.fileDropped.emit(files);
    }
}
}   