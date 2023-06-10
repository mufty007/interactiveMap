import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'https://api.worldbank.org/v2/country';

  constructor(private http: HttpClient) {}

  getCountryInfo(url: string): Observable<any> {
    return this.http.get(url).pipe(
      map<any, { name: string; capital: string; region: string; incomeLevel: string; iso2Code: string; lendingType: string } | null>((data: any) => {
        const countryData = data[1]?.[0];
        if (!countryData) {
          return null;
        }

        const countryInfo = {
          name: countryData.name,
          iso2Code: countryData.iso2Code,
          capital: countryData.capitalCity,
          region: countryData.region?.value,
          incomeLevel: countryData.incomeLevel?.value,
          lendingType: countryData.lendingType?.value
        };
        return countryInfo;
      })
    );
  }


}
