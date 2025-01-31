describe('Import artifact report controller', () => {
  var importArtifactService, importArtifactReportCtrl, report, modalInstance, $q, $rootScope;

  beforeEach(angular.mock.module('bonitasoft.designer.home.import', 'mock.modal'));

  beforeEach(inject(function($controller, _importArtifactService_, _$modalInstance_, _$q_, _$rootScope_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    importArtifactService = _importArtifactService_;
    modalInstance = _$modalInstance_.create();
    report = {};
    importArtifactReportCtrl = $controller('ImportReportPopupController', {
      $modalInstance: modalInstance,
      type: 'page',
      title: 'Import a new page',
      importReport: report
    });
  }));

  it('should expose data for view', () => {
    expect(importArtifactReportCtrl.report).toEqual(report);
  });

  it('should force import', () => {
    spyOn(importArtifactService, 'forceImport').and.returnValue($q.when({}));
    importArtifactReportCtrl.forceImport();
    expect(importArtifactService.forceImport).toHaveBeenCalledWith(report);
  });

  it('should dismiss pop up on force import error', function() {
    var deferred = $q.defer();
    spyOn(importArtifactService, 'forceImport').and.returnValue(deferred.promise);

    importArtifactReportCtrl.forceImport();
    deferred.reject();
    $rootScope.$apply();

    expect(modalInstance.dismiss).toHaveBeenCalled();
  });

  it('should close pop up on force import success', function() {
    var deferred = $q.defer();
    spyOn(importArtifactService, 'forceImport').and.returnValue(deferred.promise);

    importArtifactReportCtrl.forceImport();
    deferred.resolve();
    $rootScope.$apply();

    expect(modalInstance.close).toHaveBeenCalled();
  });
});
