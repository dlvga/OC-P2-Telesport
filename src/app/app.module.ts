import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CountryCardComponent } from './components/country-card/country-card.component';
import { HeaderComponent } from './components/header/header.component';
import { MedalChartComponent } from './components/medal-chart/medal-chart.component';
import { PageLoadingSkeletonComponent } from './components/page-loading-skeleton/page-loading-skeleton.component';
import { PageStatusPanelComponent } from './components/page-status-panel/page-status-panel.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CountryComponent } from './pages/country/country.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, CountryComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HeaderComponent,
    CountryCardComponent,
    MedalChartComponent,
    PageLoadingSkeletonComponent,
    PageStatusPanelComponent,
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
