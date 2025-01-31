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

package org.bonitasoft.web.designer.controller;

import static org.springframework.web.servlet.HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE;
import static org.springframework.web.servlet.HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE;

import javax.inject.Named;
import javax.servlet.http.HttpServletRequest;

import org.springframework.util.AntPathMatcher;

@Named
public class RequestMappingUtils {

    public String extractPathWithinPattern(HttpServletRequest request) {
        return new AntPathMatcher().extractPathWithinPattern(
                (String) request.getAttribute(BEST_MATCHING_PATTERN_ATTRIBUTE),
                (String) request.getAttribute(PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE));
    }
}
