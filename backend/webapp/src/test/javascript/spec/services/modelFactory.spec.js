describe('Service: modelFactory', function() {

  beforeEach(module('bonitasoft.ui.services'));

  var dataModel, template, scope, $httpBackend, $compile, $location, $browser, modelFactory, data = {
      foo: {
        type: 'variable',
        value: 'bar'
      },
      baz: {
        type: 'json',
        value: '{ "foo": 5 }'
      },
      qux: {
        type: 'expression',
        value: 'return $data.baz.foo * 3;'
      },
      failingExpression: {
        type: 'expression',
        value: 'return $data.unknown.value;'
      },
      urlParamTime: {
        type: 'urlparameter',
        value: 'time'
      },
      urlParamToto: {
        type: 'urlparameter',
        value: 'toto'
      },
      failingUrlParam: {
        type: 'urlparameter',
        value: 'foo'
      },
      arrayExpression: {
        type: 'expression',
        value: 'return ["pierre", "paul", "jack"];'
      }
    },
    expectedHeaders = {
      'Accept': 'application/json, text/plain, */*',
      'X-Bonita-API-Token': 'CSRF_Generated_Token'
    };

  beforeEach(inject(function(_modelFactory_, $rootScope, _$compile_, _$httpBackend_, _$location_, _$browser_) {
    $location = _$location_;
    $location.absUrl = function() {
      return "http://domain.tld?toto=bob&time=123";
    };
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $compile = _$compile_;
    $browser = _$browser_;
    modelFactory = _modelFactory_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  describe('sync data', function() {
    beforeEach(function() {
      dataModel = modelFactory.create(data);
      scope.properties = dataModel;
      template = $compile('<div>{{ properties.qux }}</div>')(scope);
      scope.$apply();
    });
    it('should allow updating a variable', function() {
      var template = $compile('<div>{{ properties.foo }}</div>')(scope);
      scope.$apply();

      expect(template.html()).toBe('bar');
      dataModel.foo = 'foobar';
      scope.$apply();

      expect(template.html()).toBe('foobar');
    });
    it('should evaluate an urlparameter', function() {
      expect(dataModel.urlParamTime).toBe('123');
      expect(dataModel.urlParamToto).toBe('bob');
      expect(dataModel.failingUrlParam).toBe('');
    });

    it('should return the same reference when expression result did not change', function() {
      expect(dataModel.arrayExpression === dataModel.arrayExpression).toBeTruthy();
    });
    it('should read a simple variable', function() {
      expect(dataModel.foo).toBe('bar');
    });

    it('should read a json variable', function() {
      expect(dataModel.baz.foo).toBe(5);
    });

    it('should evaluate an expression', function() {
      expect(dataModel.qux).toBe(15);
    });

    it('should not throws exception when the expression evaluation fail', function() {
      expect(function() {
        return dataModel.failingExpression;
      }).not.toThrow();
    });

    it('should appear in a directive', function() {
      scope.$apply();
      expect(template.html()).toBe('15');

      dataModel.baz.foo = 13;
      scope.$apply();
      expect(template.html()).toBe('39');
    });
  });


  describe('async data', function() {
    beforeEach(function() {
      data.localBar = {
        type: 'url',
        value: '/bonita/{{ foo }}/foo'
      };
      data.bar = {
        type: 'url',
        value: 'https://some.url.com/rest/{{ foo }}/foo'
      };
      dataModel = modelFactory.create(data);
      scope.properties = dataModel;
      template = $compile('<div>{{ properties.qux }}</div>')(scope);
    });
    it('should make a call to the url when accessing data for the first time', function() {
      $httpBackend.whenGET('../API/system/session/unusedId').respond(500, '');
      $httpBackend.whenGET('/bonita/bar/foo').respond(200, "foobar");
      $httpBackend.expectGET('https://some.url.com/rest/bar/foo', {
        'Accept': expectedHeaders.Accept
      }).respond(200, ['foo', 'bar', 'baz']);
      expect(dataModel.bar).toBeUndefined();
      $httpBackend.flush();
      expect(dataModel.bar).toEqual(['foo', 'bar', 'baz']);
    });
    it('should make a call to the url when url change with bonita CSRF Token', function() {
      $httpBackend.whenGET('../API/system/session/unusedId').respond(200, '');
      $httpBackend.whenGET('https://some.url.com/rest/bar/foo').respond(200, ['foo', 'bar', 'baz']);
      //setting the cookie this way will set on default page which is on localhost:90XX/
      $browser.cookies()['X-Bonita-API-Token'] = 'CSRF_Generated_Token';
      $httpBackend.expectGET('/bonita/bar/foo', expectedHeaders).respond(200, "foobar");
      expect(dataModel.localBar).toBeUndefined();
      $httpBackend.flush();
      expect(dataModel.localBar).toEqual('foobar');
    });
    it('should make a call to the url when url change without CSRF Token', function() {
      $httpBackend.whenGET('../API/system/session/unusedId').respond(200, '');
      $httpBackend.whenGET('/bonita/bar/foo').respond(200, "foobar");
      //setting the cookie this way will set on default page which is on localhost:90XX/
      $browser.cookies()['X-Bonita-API-Token'] = 'CSRF_Generated_Token';
      //CSRF Header should not be inserted because we are not on the same domain
      $httpBackend.expectGET('https://some.url.com/rest/bar/foo', {
        'Accept': expectedHeaders.Accept
      }).respond(200, "foobar");
      expect(dataModel.bar).toBeUndefined();
      $httpBackend.flush();


      $httpBackend.expectGET('https://some.url.com/rest/baz/foo', {
        'Accept': expectedHeaders.Accept
      }).respond(200, "foobaz");
      $httpBackend.whenGET('/bonita/baz/foo').respond(200, "foobar");

      dataModel.foo = 'baz';
      expect(dataModel.bar).toEqual('foobar');
      $httpBackend.flush();

      expect(dataModel.bar).toEqual("foobaz");
    });

    it('should not make a call to the url when data is undefined', function() {
      dataModel.foo = undefined;

      expect(dataModel.bar).toBeUndefined();
    });

    xit('should not make a call to the url when data is null', function() {
      $httpBackend.whenGET('../API/system/session/unusedId').respond(200, '');
      $httpBackend.whenGET('/bonita/bar/foo').respond(200, "foobar");
      $httpBackend.whenGET('https://some.url.com/rest/bar/foo').respond(200, ['foo', 'bar', 'baz']);
      dataModel.foo = null;

      expect(dataModel.bar).toBeUndefined();
      $httpBackend.flush();
    });

    it('should make a call to the url and update template once fulfilled', function() {
      $httpBackend.whenGET('../API/system/session/unusedId').respond(200, '', {
        'X-Bonita-API-Token': 'CSRF_Generated_Token'
      });
      $httpBackend.whenGET('/bonita/bar/foo').respond(200, "foobar");
      $httpBackend.expectGET('https://some.url.com/rest/bar/foo').respond(200, ['foo', 'bar', 'baz']);
      var template = $compile('<div>{{ properties.bar }}</div>')(scope);
      scope.$apply();

      expect(template.html()).toBe('');
      $httpBackend.flush();

      expect(template.html()).toBe('["foo","bar","baz"]');
    });
  });

});
