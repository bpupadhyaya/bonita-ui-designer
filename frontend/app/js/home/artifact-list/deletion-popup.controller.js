/**
 * Copyright (C) 2015 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
angular.module('bonitasoft.designer.home').controller('DeletionPopUpController', function($scope, $modalInstance, artifact, type) {

  'use strict';

  /**
   * artifact is the element to be deleted. Could be a page or a widget. Should have an id
   */
  $scope.artifact = artifact;
  $scope.artifact.type = type;

  $scope.ok = function() {
    $modalInstance.close($scope.artifact.id);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

});
