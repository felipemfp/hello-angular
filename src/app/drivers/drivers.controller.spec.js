(function() {
  'use strict';

  describe('controllers', function() {
    var vm, $httpBackend, ergastAPI;

    beforeEach(module('helloAngular'));
    beforeEach(inject(function(_$controller_, _$httpBackend_, _ergastAPI_) {
      vm = _$controller_('DriversController');
      ergastAPI = _ergastAPI_;

      // Then we create an $httpBackend instance. I'll talk about it below.
      $httpBackend = _$httpBackend_;

      // Here, we set the httpBackend standard response to the URL the controller is
      // supposed to retrieve from the API
      $httpBackend
        .expectJSONP(ergastAPI.apiHost + "/driverStandings.json?callback=JSON_CALLBACK")
        .respond({
          "MRData": {
            "StandingsTable": {
              "StandingsLists": [{
                "DriverStandings": [{
                  "Driver": {
                    "givenName": 'Sebastian',
                    "familyName": 'Vettel'
                  },
                  "points": "397",
                  "nationality": "German",
                  "Constructors": [{
                    "name": "Red Bull"
                  }]
                }, {
                  "Driver": {
                    "givenName": 'Fernando',
                    "familyName": 'Alonso'
                  },
                  "points": "242",
                  "nationality": "Spanish",
                  "Constructors": [{
                    "name": "Ferrari"
                  }]
                }, {
                  "Driver": {
                    "givenName": 'Mark',
                    "familyName": 'Webber'
                  },
                  "points": "199",
                  "nationality": "Australian",
                  "Constructors": [{
                    "name": "Red Bull"
                  }]
                }]
              }]
            }
          }
        });

      // Then we flush the httpBackend to resolve the fake http call
      $httpBackend.flush();
    }));

    // Now, for the actual test, let's check if the driversList is actually retrieving
    // the mock driver array
    it('should return a list with three drivers', function() {
      expect(vm.driversList.length).toBe(3);
    });

    // Let's also make a second test checking if the drivers attributes match against
    // the expected values
    it('should retrieve the family names of the drivers', function() {
      expect(vm.driversList[0].Driver.familyName).toBe("Vettel");
      expect(vm.driversList[1].Driver.familyName).toBe("Alonso");
      expect(vm.driversList[2].Driver.familyName).toBe("Webber");
    });

    it('should filter by family name or given name', function() {
      vm.nameFilter = 'Alonso';
      expect(vm.searchFilter(vm.driversList[0])).toBeFalsy(); // Sebastian Vettel
      expect(vm.searchFilter(vm.driversList[1])).toBeTruthy(); // Fernando Alonso
      expect(vm.searchFilter(vm.driversList[2])).toBeFalsy(); // Mark Webber
      vm.nameFilter = 'Mark';
      expect(vm.searchFilter(vm.driversList[0])).toBeFalsy(); // Sebastian Vettel
      expect(vm.searchFilter(vm.driversList[1])).toBeFalsy(); // Fernando Alonso
      expect(vm.searchFilter(vm.driversList[2])).toBeTruthy(); // Mark Webber
      vm.nameFilter = 'German';
      expect(vm.searchFilter(vm.driversList[0])).toBeFalsy(); // Sebastian Vettel
      expect(vm.searchFilter(vm.driversList[1])).toBeFalsy(); // Fernando Alonso
      expect(vm.searchFilter(vm.driversList[2])).toBeFalsy(); // Mark Webber
    });
  });
})();
