import { NgModule, Pipe, PipeTransform } from '@angular/core';

export function mockPipe(options: Pipe): Pipe {
  const metadata: Pipe = {
    name: options.name
  };

  return <any>Pipe(metadata)(class MockPipe {});
}

/**
 * This pipe class is used to display english or arabic value
 *
 * @export
 * @class UpperCasePipeMock
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'uppercase',
  pure: false
})
export class UpperCasePipeMock implements PipeTransform {
  lang = 'en';

  transform(object: string): string {
    return object.toUpperCase();
  }
}

@NgModule({
  declarations: [UpperCasePipeMock]
})
export class CoreTestingModule {}
