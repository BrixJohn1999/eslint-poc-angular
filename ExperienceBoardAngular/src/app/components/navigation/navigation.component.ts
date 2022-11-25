import { Component, OnInit } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  constructor(private readonly authService: AuthService) {}
  propertiesUrl = environment.propertiesUrl;
  ordersUrl = environment.ordersUrl;
  reportsUrl = environment.reportsUrl;
  companiesUrl = environment.companiesUrl;
  teamsUrl = environment.teamsUrl;
  systemSettingsUrl = environment.systemSettingsUrl;
  faSearch = faSearch;
  faBell = faBell;
  toggle: boolean = false;

  ngOnInit(): void {}
  async onLogout() {
    if (this.authService.getCookie('rsid')?.toString()) {
      const rtoken = this.authService.getCookie('rsid')?.toString();
      await this.authService.deleteSession(rtoken);
      this.authService.deleteCookie('rsid');
    }
    window.location.reload();
  }

  toggleDropdown() {
    this.toggle = !this.toggle;
  }

  formatName(name: any): string {
    const matches = name.match(/\b(\w)/g);
    const acronym = matches.join('');
    return acronym;
  }

  clickSearch() {}

  onCloseSearch() {}
}
