import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-map',
  templateUrl: './my-map.component.html',
  styleUrls: ['./my-map.component.css']
})
export class MyMapComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  selectedCountryInfo: any;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadMap();
  }

  onCountryClick(countryIdentifier: string) {
    this.selectedCountryInfo = null;

    // Check if the countryIdentifier is an ISO2 code or country name
    const worldBankUrl = isNaN(Number(countryIdentifier))
      ? `https://api.worldbank.org/v2/country/${countryIdentifier}?format=json`
      : `https://api.worldbank.org/v2/country/?${countryIdentifier}&format=json`;

    this.apiService.getCountryInfo(worldBankUrl).subscribe((data) => {
      if (data) {
        this.selectedCountryInfo = data;
      }
    });
  }



  loadMap() {
    fetch('../../assets/world.svg')
      .then((response) => response.text())
      .then((svg) => {
        this.mapContainer.nativeElement.innerHTML = svg;
        const svgElement = this.mapContainer.nativeElement.querySelector('svg');
        if (svgElement) {
          svgElement.setAttribute('width', '510%');
          svgElement.setAttribute('height', '100%');
        }


        const countries = this.mapContainer.nativeElement.querySelectorAll('path');
        let previouslySelectedCountry: SVGPathElement | null = null;

        countries.forEach((country: SVGPathElement) => {
          // Change the background color on hover
          country.addEventListener('mouseenter', () => {
            country.style.fill = '#FFC107'; // Hover color
            country.style.cursor = 'pointer';
          });

          // Revert the background color when the mouse leaves, if it's not the selected country
          country.addEventListener('mouseleave', () => {
            if (country !== previouslySelectedCountry) {
              country.style.fill = ''; // Default color
            }
          });

          // Change the background color when clicked and reset the previously selected country color
          country.addEventListener('click', () => {
            if (previouslySelectedCountry) {
              previouslySelectedCountry.style.fill = ''; // Default color
            }

            country.style.fill = '#007BFF'; // Selected color
            previouslySelectedCountry = country;

            const countryClassName = country.getAttribute('class');

            const countryID = country.id;

            const countryName = country.getAttribute('name')

            const identifier = countryID.toString() || countryName || countryClassName || '';

            this.onCountryClick(identifier);
          });
        });
      });
  }


}
