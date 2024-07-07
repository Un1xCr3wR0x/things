import {NgModule} from "@angular/core";
import {HomeRoutingModule} from "./home-routing.module";
import {ThemeModule} from "@gosi-ui/foundation-theme";
import {LAYOUT_COMPONENTS} from "./components";

@NgModule({
  imports: [HomeRoutingModule, ThemeModule],
  declarations: [...LAYOUT_COMPONENTS],
  exports: [...LAYOUT_COMPONENTS]
})
export class HomeModule {}
