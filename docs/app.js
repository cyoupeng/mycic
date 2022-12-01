// oinp
/////var app = angular.module('app', ['angularFileUpload' , 'ngFileSaver'])
var deps =   (  typeof  _FILE_UPLOAD === 'undefined' ||  !_FILE_UPLOAD ) ? [] :  ['angularFileUpload'];

if (typeof  _FILE_SAVE !== 'undefined' && _FILE_SAVE) {
	deps.push('ngFileSaver');
}

var app = angular.module('app', deps)

.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.cache = false;
	if (!$httpProvider.defaults.headers.get) {
		$httpProvider.defaults.headers.get = {};
	}
	// disable IE ajax request caching
	$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Fri, 01 Jan 2010 00:00:00 GMT';
	$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
	$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';	  

}])

.controller('mainCtrl', function ($scope, model, readonly, $document) {
    $scope.model = model;

    if (model && model.keyStaff) {
        $scope.model.keyStaff = _($scope.model.keyStaff).sortBy(function(item){
            return item.orderNum;
        });

        if (model.index && model.index <= model.keyStaff.length) {
            var s = $scope.model.keyStaff[model.index-1];
            $scope.staff = s;
            $scope.index = model.index;
            if (!(s.firstName && s.lastName)) {
                $scope.nodoc = true;
            }
        }
    }
    
    if (readonly == 'true') {
        $document.ready(function(){
            $('.mainPanel :button , .mainPanel :radio').not('.system').attr('disabled',true);
            $('.mainPanel :input').not('.system').not(':button').not(":radio").prop('readonly',true);

        });
    }
})  

.directive('springMessage', function ($http, context) {
    var url = context + '/message';
    return {
        restrict: 'AE',
        replace: true,
        link: function postLink($scope, elem, attrs) {
            $http.get(url + '/' + attrs.locale, {
                params: {
                    key: attrs.key
                },
                headers: {
                    Accept: 'text/plain'
                }
            }).then(function (resp) {
                elem.html(resp.data);
            }, function (err) {
                elem.html(err.data);
            });
        }
    }
})

.filter('enableImg', function () {
    return function (indicator) {
        return indicator >= 1 ? 'yes' : 'no';
    };
})

.filter('enableBtn', function () {
    return function (indicator) {
        return indicator >= 1 ? 'Disable' : 'Enable';
    };
})

.filter('landingIcon', function () {
    return function (indicator) {
        return indicator >= 1 ? '' : '_G2';
    };
})

.filter('statusIcon', function () {
    return function (indicator) {
        //var names = ['pending', 'yes', 'no'];
    	var names = ['v.png', 'y.png', 'n.png'];
        return names[indicator % 3];
    };
})

.filter('singleQuote', function() {
    return function (input) {
        if (input) {
            return input.toString().replace(/"/g, "'");  
        }
    };
})

.filter('encode', function() {
    return function (input) {
        if (input) {
            return btoa(input);
        }
    };
})

.filter('toggleClass', function() {
    return function (input) {
        if (input) {
            return "collapse";  
        } else {
            return "expand";  
        }
    };
})

.component('score', {
    template: '<span data-ng-show="$ctrl.model.oldScore != $ctrl.model.newScore" style="text-decoration:line-through">{{$ctrl.model.oldScore}}</span><span data-ng-show="$ctrl.model.oldScore != $ctrl.model.newScore" >&nbsp;&nbsp;</span><span>{{$ctrl.model.newScore}}</span>',
    bindings: {
        model: '='
    }
})

.directive('stringToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return '' + value;
      });
      ngModel.$formatters.push(function(value) {
        return parseInt(value);
      });
    }
  };
})

.directive('formElement', function ($http, $compile) {
    var defaults = {
        mandatory: '', required: '', maxLength: '', decor: '', disabled:'',
        label: '', path: '', errMsg: '', placeholder: '', classes:'', min:'',max:'',
        help: {
            label: '', content: ''
        }
    };
    return {
        scope: {
            config: '=',
            model: '='
        },
        link: function postLink(scope, elem, attrs) {
            var template = '';
            var config = scope.config;
            if (!config.noTitle) {
                template += '<label class="inline <%=mandatory%>" title=""><%=label%></label>';
                if (config.help && config.help.label) {
                    template += '<button type="button" class="btn btn-info btn-xs" style="margin-left: 10px" data-toggle="popover" data-placement="bottom" data-content="<%=help.content%>" data-original-title="" title=""><span class="glyphicon glyphicon-info-sign"></span> <%=help.label%></button>';
                }
            }
            if (config.type == 'text') {
                template += '<input data-ng-model="model.<%=path%>" data-error="<%=errMsg%>" placeholder="<%=placeholder%>" class="form-control form-element <%=classes%>" <%=required%> type="text" maxlength="<%=maxLength%>" <%=decor%> <%=disabled%>> <div class="help-block with-errors"></div>';
            }
            if (config.type == 'number') {
                template += '<input data-ng-model="model.<%=path%>" string-to-number data-error="<%=errMsg%>" placeholder="<%=placeholder%>" class="form-control form-element" <%=required%> type="number" <%=min%> <%=max%> <%=disabled%>> <div class="help-block with-errors"></div>';
            }
            if (config.type == 'radio' && config.lovs && config.lovs.length > 0) {
                _.each(config.lovs, function(item,index){
                    template += '<div class="radio"><label><input <%=required%> type="radio" data-error="<%=errMsg%>" data-ng-model="model.<%=path%>" value="<%=lovs[' + index + '].value%>" name="<%=path%><%=index%>" class="nginput"><%=lovs[' + index + '].label%></label></div>';
                });
                template += '<div class="help-block with-errors"></div>';
            }
            
            if (config.type == 'date') {
                template += '<div class="input-group">';
                template += '<input id="i_<%=path%><%=index%>"';
                template += '  data-ng-model="model.<%=path%>" data-commondate-error="<%=errMsg%>"';
                template += '  data-error="<%=errMsg%>" placeholder="<%=placeholder%>"';
                template += '  class="form-control dateinput" <%=required%>';
                template += '  type="text" data-date-format="dd/mm/yyyy" maxlength="10"';
                template += '  autocomplete="off" ';
                template += '  data-validdate3-error="<%=errMsg%>" <%=decor%> <%=disabled%>> <label';
                template += '  class="input-group-btn dateicon" style="visibility: hidden;" for="i_<%=path%><%=index%>"> <span class="btn btn-default"> <span class="glyphicon glyphicon-calendar"></span></span></label></div><div class="help-block with-errors"></div>';
            }
            
            if (config.type == 'textarea') {
                template += '<textarea data-ng-model="model.<%=path%>" maxlength="1000" <%=required%> data-error="<%=errMsg%>" rows="7" cols="30" class="form-control form-element" data-error="${msgsactivityDetailsRequired }" <%=decor%> <%=disabled%>/> <div class="help-block with-errors"></div>';
            }

            if (config.mandatory) {
                config.mandatory = 'mandatory-label';
                config.required = 'required';
            }
            if (config.disabled) {
                config.disabled = 'disabled';
            }
            if (config.min) {
                config.min = 'min="' + config.min + '"';
            }
            if (config.max) {
                config.max = 'max="' + config.max + '"';
            }

            var e = angular.element(_.template(template)(_.defaults(_.extend(config,{index:_.uniqueId()}), defaults)));
            elem.append(e);
            $compile(e)(scope);
            
            e.find('.dateinput').mask('99/99/9999');
        }
    }
})

.factory('utils', function () {
    function calendarPop() {
            $(".dateicon").on('click',function(){
                var ctr = $("#"+$(this).attr('for'));
                    ctr.datepicker('destroy');
                    ctr.datepicker({
                           startView : ctr.val() == '' ? 3 : 0,
                           showOnFocus: false,
                           language: locale,
                           autoclose: true,
                           startDate: '-100y',
                       });		   
                    ctr.datepicker('show');
               });
            
            $(".oinp-date").mask('99/99/9999');
            
        };
    
    return {
        calendarPop: calendarPop,
        
        appDateReload: function() {
            $(window).$DF().getComponent('appsubmitdate').reload();
        },
        
        setDirty: function() {
            $('#dirtyFlag').val('1');
        },
        
        reinitiateform: function(setting) {
            var _setting = _.extend({popover:true,calendar:true}, setting);
            if (_setting.popover) {
                $('[data-toggle="popover"]').popover({html:true});
            }
            if (_setting.calendar) {
                calendarPop();
            }
        }
    };
})

.controller('streamAdminCtrl', function ($scope, $http, context, model) {
    $scope.streams = model;
    $scope.toggle = function (stream) {
        stream.enableEoi = (stream.enableEoi + 1) % 2;
        $http.get(context + '/protected/administration/oinpstream/enable', {
            params: {
                code: stream.oinpStreamCode,
                value: stream.enableEoi
            }
        }).then(function (resp) {
            console.log("updated!");
        }, function (err) {
            stream.enableEoi = (stream.enableEoi + 1) % 2;
        })
    };
})

.controller('eoiScoreEditCtrl', function ($http, $scope, context) {
    $scope.scores = {
    	loading: true,
    	savable: false,
        total: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        labourMarket: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            show: true,
            newValue: ''
        },
        edu: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            show: true,
            newValue: ''
        },
        lang: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            show: true,
            newValue: ''
        },
        regionalization: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            show: true,
            newValue: ''
        },
        strategicpriorities: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            show: true,
            newValue: ''
        },
        edu_level: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        edu_numCredentials: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        lm_nocSkillLevel: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        edu_studyfield: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        lm_joboffer_noc: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        lm_noc_type: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        lm_hw: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        lm_noc: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        cwe_sl: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        cwe_emplen: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        cwe_hist: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        lang_ablt: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        lang_offical: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        regional_cd: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        regional_loc: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        oinp_init: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        }
        
        ,wkstatus :{
        	  status: 0,
              oldScore: 0,
              newScore: 0,
              newValue: ''
        }
    };

	$scope.toggle = function(model, exclude) {
		if (typeof(model.newValue) == 'object' && !exclude) {
			model.newScore = model.newValue.score;
		} 
		model.status=model.status%2+1;
		
	    $scope.scores.savable = true;
	};
    
	$scope.change = function(model, exclude) {
		if (typeof(model.newValue) == 'object' && !exclude) {
			model.newScore = model.newValue.score;
		} 
        
        calculateScores();
    };
    
    
    var calculateScores = function() {
        // recalculate total score
        score = 0;
        keys = ['lm_nocSkillLevel','edu_level', 'edu_numCredentials','edu_studyfield', 'lm_joboffer_noc' , 
        		'lm_noc_type', 'lm_hw', 'lm_noc', 'cwe_sl', 'cwe_emplen', 'cwe_hist', 
        		'lang_ablt', 'lang_offical', 'regional_cd', 'regional_loc','oinp_init','wkstatus'];
        angular.forEach($scope.scores, function(obj, key) {
            if (keys.indexOf(key) >= 0) {
                score += obj.newScore;
                console.log(key + ' - ' + obj.newScore + ' [total]' + score);
            }
        });
        $scope.scores.total.newScore = score;
        
        // save button
        $scope.scores.savable = canSave();
	};
    
    var canSave = function() {
        var result = true;
        var keys = ['lm_nocSkillLevel','edu_level', 'edu_numCredentials','edu_studyfield', 'lm_joboffer_noc' , 
    		'lm_noc_type', 'lm_hw', 'lm_noc', 'cwe_sl', 'cwe_emplen', 'cwe_hist', 
    		'lang_ablt', 'lang_offical', 'regional_cd', 'regional_loc','oinp_init', 'wkstatus'];
        angular.forEach($scope.scores, function(score, key) {
            if (keys.indexOf(key) >= 0 && score.status != 1) {
                result = false;
            }
        });
        return result;
    };
    
    var init = function() {
    	$scope.scores.loading = false;
    	
    	$http({
    	    url: context + '/internalapp/cmod/eoiScoreRule', 
    	    method: "GET",
    	    params: {caseType: $scope.model.caseType}
    	 }).then(function (resp) {
            $scope.scores.options = resp.data;
            
            // merge model into score
            angular.merge($scope.scores, $scope.model);
            
        	// init selected element values 
            var keys = ['lm_nocSkillLevel','edu_level', 'edu_numCredentials','edu_studyfield', 'lm_joboffer_noc' , 
        		'lm_noc_type', 'lm_hw', 'lm_noc', 'cwe_sl', 'cwe_emplen', 'cwe_hist', 
        		'lang_ablt', 'lang_offical', 'regional_cd', 'regional_loc','oinp_init', 'wkstatus'];
            var options = ['JOIS_NOC_5_TEER','JOIS_EDU_LEVEL','JOIS_EDU_CAN_CRD', 'JOIS_CIPS', 'JOIS_JOB_OFFER_NOC', 
            	'JOIS_NOC_5_BOC', 'JOIS_JOB_OFFER_HW', 'JOIS_NOC_5', 'JOIS_CWE_SKILL_LEVEL', 'JOIS_CWE_EMP_LEN', 'JOIS_CWE_HISTORY', 
                        'JOIS_LANG_ABILITY', 'JOIS_OFFICAL_LANG', 'JOIS_CD', 'JOIS_CD', 'JOIS_STR_PRIO_INITIATIVE', 'EOI_WORKPERMIT_STATUS'];
            angular.forEach($scope.scores, function(score, key) {
                if (keys.indexOf(key) >= 0) {
                    var k = score.newValue;
                    var select;
                    var optionKey = options[keys.indexOf(key)];
                    angular.forEach($scope.scores.options[optionKey], function(elem) {
                    	if (elem.value == score.newValue) {
                    		select = elem;
                    	}
                    })
                    score.newValue = select;
                }
            });
            
            calculateScores();
            
            // first time load
            if ($scope.scores.init) {
            	// calculated fields
           	var keys = ['total'];
            	angular.forEach(keys, function(key) {
            		var score = $scope.scores[key];
            		score.oldScore = score.newScore;
            	});
            }            
        }, function (err) {
            console.log('error')
        });
    }();
	
    $scope.save = function(caseId, pid) {
    	blockingUI();
    	var data = {};
    	// all model
        var keys = ['total','lm_nocSkillLevel','edu_level', 'edu_numCredentials','edu_studyfield', 'lm_joboffer_noc' , 
    		'lm_noc_type', 'lm_hw', 'lm_noc', 'cwe_sl', 'cwe_emplen', 'cwe_hist', 
    		'lang_ablt', 'lang_offical', 'regional_cd', 'regional_loc','oinp_init','wkstatus'];
        angular.forEach($scope.scores, function(score, key) {
            if (keys.indexOf(key) >= 0) {
            	var s = angular.extend({}, score);
            	if (typeof(s.newValue) == 'object') {
            		s.newValue = s.newValue.value;
            	}
            	data[key] = s;
            }
        });
        
        $http.post(context + '/internalapp/scores/' + caseId + "/" + pid, data).then(function (resp) {
            console.log(resp);
            location.reload();
        }, function (err) {
            console.log('error')
        });
    };
    
    $scope.reset = function() {
    	
    	location.reload();
    }
})

.controller('scoreEditCtrl', function ($http, $scope, context) {
	$scope.wip = false;
	
    $scope.scores = {
    	loading: true,
    	savable: false,
        total: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        age: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            show: true,
            newValue: ''
        },
        edu: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            show: true,
            newValue: ''
        },
        emp: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            show: false,
            newValue: ''
        },
        work: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            show: false,
            newValue: ''
        },
        adapt: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            show: true,
            newValue: ''
        },
        adapt_emp: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        adapt_rel: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        adapt_worked: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        adapt_spemp: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        adapt_edu: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        adapt_spedu: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        adapt_splang: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        lang: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            show: true,
            newValue: ''
        },
        langpr: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        langprr: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        langprw: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        langprs: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        langprl: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: ''
        },
        langse: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            show: false,
            newValue: ''
        },
        langser: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: 'a'
        },
        langsew: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: 'a'
        },
        langses: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: 'a'
        },
        langsel: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: 'a'
        },
        langspr: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: 'a'
        },
        langspw: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: 'a'
        },
        langsps: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: 'a'
        },
        langspl: {
            status: 0,
            oldScore: 0,
            newScore: 0,
            newValue: 'a'
        }
    };

	$scope.toggle = function(model) {
		if (typeof(model.newValue) == 'object') {
			model.newScore = model.newValue.score;
		} 
		model.status=model.status%2+1;
		
	    $scope.scores.savable = true;
	};
    
	$scope.change = function(model) {
		if (typeof(model.newValue) == 'object') {
			model.newScore = model.newValue.score;
		} 
        
        calculateScores();
    };
    
    var calculateScores = function() {
        // recalculate language score
        var score = 0;
        var keys = ['langprr', 'langprw', 'langprl', 'langprs'];
        angular.forEach($scope.scores, function(obj, key) {
            if (keys.indexOf(key) >= 0) {
                score += obj.newScore;
            }
        });
        $scope.scores.langpr.newScore = score;

        score = 0;
        keys = ['langpr', 'langse'];
        angular.forEach($scope.scores, function(obj, key) {
            if (keys.indexOf(key) >= 0) {
                score += obj.newScore;
            }
        });
        $scope.scores.lang.newScore = score;

        // recalculate adaptability score
        score = 0;
        keys = ['adapt_emp', 'adapt_rel', 'adapt_worked', 'adapt_spemp', 'adapt_edu', 'adapt_spedu', 'adapt_splang'];
        angular.forEach($scope.scores, function(obj, key) {
            if (keys.indexOf(key) >= 0) {
                score += obj.newScore;
            }
        });
        if (score >= 10) {
            score = 10;
        }
        $scope.scores.adapt.newScore = score;

        // recalculate total score
        score = 0;
        keys = ['age', 'edu', 'emp', 'work', 'lang', 'adapt'];
        angular.forEach($scope.scores, function(obj, key) {
            if (keys.indexOf(key) >= 0) {
                score += obj.newScore;
            }
        });
        $scope.scores.total.newScore = score;
        
        // save button
        $scope.scores.savable = canSave();
	};
    
    var canSave = function() {
        var result = true;
        var keys = ['age', 'edu', 'emp', 'work', 'langprr', 'langprw', 'langprl', 'langprs', 'langse', 
                    'adapt_emp', 'adapt_rel', 'adapt_worked', 'adapt_spemp', 'adapt_edu', 'adapt_spedu', 'adapt_splang'];
        angular.forEach($scope.scores, function(score, key) {
            if (keys.indexOf(key) >= 0 && score.status != 1) {
                result = false;
            }
        });
        return result;
    };
    
    var init = function() {
    	$scope.scores.loading = false;
    	
        $http.get(context + '/resources/js/scorerules.json').then(function (resp) {
            $scope.scores.options = resp.data;
            
            // merge model into score
            angular.merge($scope.scores, $scope.model);
            
        	// init selected element values 
            var keys = ['age', 'edu', 'emp', 'work', 'langprr', 'langprw', 'langprl', 'langprs', 'langse', 
                        'adapt_emp', 'adapt_rel', 'adapt_worked', 'adapt_spemp', 'adapt_edu', 'adapt_spedu', 'adapt_splang'];
            var options = ['age', 'edu', 'emp', 'work', 'langpr', 'langpr', 'langpr', 'langpr', 'langse', 
                        'adapt_options', 'adapt_options', 'adapt_worked', 'adapt_options', 'adapt_options', 'adapt_options', 'adapt_options'];
            angular.forEach($scope.scores, function(score, key) {
                if (keys.indexOf(key) >= 0) {
                    var k = score.newValue;
                    var select;
                    var optionKey = options[keys.indexOf(key)];
                    angular.forEach($scope.scores.options[optionKey], function(elem) {
                    	if (elem.value == score.newValue) {
                    		select = elem;
                    	}
                    })
                    score.newValue = select;
                }
            });
            
            calculateScores();
            
            // first time load
            if ($scope.scores.init) {
            	// calculated fields
            	var keys = ['lang', 'langpr', 'adapt', 'total'];
            	angular.forEach(keys, function(key) {
            		var score = $scope.scores[key];
            		score.oldScore = score.newScore;
            	});
            }            
        }, function (err) {
            console.log('error')
        });
    }();
	
    $scope.save = function(caseId, pid) {
    	blockingUI();
    	var data = {};
    	// all model
        var keys = ['total', 'age', 'edu', 'emp', 'work', 'lang', 'langpr', 'langprr', 'langprw', 'langprl', 'langprs', 'langse', 
                    'adapt', 'adapt_emp', 'adapt_rel', 'adapt_worked', 'adapt_spemp', 'adapt_edu', 'adapt_spedu', 'adapt_splang'];
        angular.forEach($scope.scores, function(score, key) {
            if (keys.indexOf(key) >= 0) {
            	var s = angular.extend({}, score);
            	if (typeof(s.newValue) == 'object') {
            		s.newValue = s.newValue.value;
            	}
            	data[key] = s;
            }
        });
        
        $http.post(context + '/internalapp/scores/' + caseId + "/" + pid, data).then(function (resp) {
            console.log(resp);
            location.reload();
        }, function (err) {
            console.log('error')
        });
    };
    
    $scope.reset = function(caseId, pid) {
    	$('#confirmDlg').modal('show');
    };
    
    $scope.doReset = function(caseId, pid) {
    	$scope.wip = true;
    	$http.post(context + '/internalapp/resetscores/' + caseId + "/" + pid, {}).then(function (resp) {
            console.log(resp);
            location.reload();
        }, function (err) {
            console.log('error')
        });    
    }
    
    
})

.controller('immiHistoryCtrl', function ($scope, $timeout, $document, utils) {
    $scope.items = [{}];
    if ($scope.model.prHistory) {
        $scope.items = $scope.model.prHistory;
    }
    if ($scope.items.length == 0) {
        $scope.items.push({});
    }
    
	$document.ready(function(){
        $(".dateicon").unbind('click').on('click',function(){
            var ctr = $("#"+$(this).attr('for'));
            if (!ctr.length) {
            	ctr = $("#"+$(this).attr('data-for'));
            }
            
            var mindate = new Date(1900,0,1);
    		var maxdate = new Date(2050,0,1);   
    		   
    		var bdate = $(ctr) ;
    		   
    		if($(bdate).data('min-date')){
    			   mindate = $(bdate).data('min-date'); 
    		}
    		if($(bdate).data('max-date')){
    			   maxdate = $(bdate).data('max-date'); 
    		}
    		            
    		ctr.datepicker( "setDate" , null );

                ctr.datepicker('destroy');
                ctr.datepicker({
                       startView : ctr.val() == '' ? 3 : 0,
                       showOnFocus: false,
                       language: locale,
                       autoclose: true,
                       startDate: mindate,
                       endDate: maxdate  
                   });		   
                ctr.datepicker('show');
           });
	});
    
    $scope.add = function() {
        var filled = true;
        angular.forEach($scope.items, function(item){
           if (!(item && item.location && item.appDate)) {
               filled = false;
           } 
        });
        if (filled) {
            $scope.items.push({});

            $timeout(function() {
                $(".dateicon").unbind('click').on('click',function(){
                var ctr = $("#"+$(this).attr('for'));
                    ctr.datepicker('destroy');
                    ctr.datepicker({
                           startView : ctr.val() == '' ? 3 : 0,
                           showOnFocus: false,
                           language: locale,
                           autoclose: true,
                           startDate: '-100y',
                       });		   
                    ctr.datepicker('show');
               });
                
                utils.appDateReload();
            }, 0);
        }
        $timeout(function(){
            $('[data-toggle="popover"]').popover({html:true});
        });
    };
    
    $scope.remove = function(item) {
        $scope.items.splice($scope.items.indexOf(item), 1);
        if ($scope.items.length == 0) {
            $scope.items.push({});
            $timeout(function() {
                $(".dateicon").on('click',function(){
                var ctr = $("#"+$(this).attr('for'));
                    ctr.datepicker('destroy');
                    ctr.datepicker({
                           startView : ctr.val() == '' ? 3 : 0,
                           showOnFocus: false,
                           language: locale,
                           autoclose: true,
                           startDate: '-100y',
                       });		   
                    ctr.datepicker('show');
               });
                
                $('[data-toggle="popover"]').popover({html:true});
                
                utils.appDateReload();
            }, 0);
        }
    };
})

.controller('pnpHistoryCtrl', function ($scope, $timeout, utils) {
    $scope.items = [{}];
    if ($scope.model.pnpHistory) {
        $scope.items = $scope.model.pnpHistory;
    }
    if ($scope.items.length == 0) {
        $scope.items.push({});
    }
    
    $scope.add = function() {
        var filled = true;
        angular.forEach($scope.items, function(item){
           if (!(item && item.location && item.appDate)) {
               filled = false;
           } 
        });
        if (filled) {
            $scope.items.push({});

            $timeout(function() {
                $(".dateicon").unbind('click').on('click',function(){
                var ctr = $("#"+$(this).attr('for'));
                    ctr.datepicker('destroy');
                    ctr.datepicker({
                           startView : ctr.val() == '' ? 3 : 0,
                           showOnFocus: false,
                           language: locale,
                           autoclose: true,
                           startDate: '-100y',
                       });		   
                    ctr.datepicker('show');
               });
                
                utils.appDateReload();
            }, 0);
        }
    };
    
    $scope.remove = function(item) {
        $scope.items.splice($scope.items.indexOf(item), 1);
        if ($scope.items.length == 0) {
            $scope.items.push({});
            $timeout(function() {
                $(".dateicon").on('click',function(){
                var ctr = $("#"+$(this).attr('for'));
                    ctr.datepicker('destroy');
                    ctr.datepicker({
                           startView : ctr.val() == '' ? 3 : 0,
                           showOnFocus: false,
                           language: locale,
                           autoclose: true,
                           startDate: '-100y',
                       });		   
                    ctr.datepicker('show');
               });
                utils.appDateReload();
            }, 0);
        }
    };
})

.controller('travelHistoryCtrl', ['$scope', '$timeout', 'utils', function ($scope, $timeout, utils) {
    $scope.items = [{}];
    if ($scope.model.travelHistory) {
        $scope.items = $scope.model.travelHistory;
    }
    if ($scope.items.length == 0) {
        $scope.items.push({});
    }
    
    $scope.add = function() {
            $scope.items.push({});

            $timeout(function() {
                utils.calendarPop();
                utils.appDateReload();
            }, 0);
    };
    
    $scope.remove = function(item) {
        $scope.items.splice($scope.items.indexOf(item), 1);
        if ($scope.items.length == 0) {
            $scope.items.push({});
            $timeout(function() {
                utils.calendarPop();
            }, 0);
        }
    };
}])

.controller('uploadDocCtrl', ['$scope', '$timeout','$document', function ($scope, $timeout, $document) {
    if ($scope.nodoc) {
        $timeout(function(){
            $document.ready(function(){
                $('.uploadAtt').attr('disabled', true);
            });
        });
    }
}])

.controller('keyStaffCtrl', ['$scope', '$timeout', 'utils','mode', function ($scope, $timeout, utils,mode) {
    $scope.items = [];
    if ($scope.model.keyStaff) {
        $scope.items = $scope.model.keyStaff;
    }
    if ($scope.items.length < 1) {
        if ($scope.model.count > 0) {
            _.times($scope.model.count, function(n){
                $scope.items.push({});
            });
        } else {
            $scope.items.push({}, {}, {}, {}, {});
        }
    }
    //$scope.items[0].expand = true;
    
    if (mode == 'view') {
        _($scope.items).each(function(item){
            item.expand = true;
        });
    }
    
    $scope.toggle = function(item, index) {
        if (mode != 'view') {
            item.expand = !item.expand;
            var pos = 0;
            angular.forEach($scope.items, function(item){
                if (pos != index) {
                    item.expand = false;
                }
                pos++;
            });
        }
    };
    
    $scope.calculateNocLevel = function(item) {
        var code = item && item.nocCode?item.nocCode:'';
        item.nocLevel = '';
        if (code.length > 0 && code.substr(0,1) == 0) {
            item.nocLevel = '0';
        } else if (code.length > 1) {
            var index = parseInt(code.substr(1,1));
            if (index >= 0 && index <= 7) {
                item.nocLevel = ['A','A','B','B','C','C','D','D'][index];
            }
        }
    };
}])

.controller('busOwnerCtrl', ['$scope', '$timeout', 'utils', function ($scope, $timeout, utils) {
    $scope.items = [{country:'Canada'}];
    
    $scope.init = function(key) {
        $scope.items = $scope.model[key] || [{country:'Canada'}];

        if (key == 'COR_APP_OWNER_1') {
            $scope.showRetain = true;
            $scope.noEndDate = true;
        } else if (key == 'COR_APP_OWNER_2') {
            $scope.noEndDate = true;
        } 

        if (!$scope.items || $scope.items.length <= 0) {
            $scope.items = [{country:'Canada'}];
        }
    };
    
    $scope.add = function() {
        $scope.items.push({country:'Canada'});

        $timeout(function() {
            utils.setDirty();
            utils.reinitiateform();
        }, 0);
    };
    
    $scope.remove = function(item) {
        $scope.items.splice($scope.items.indexOf(item), 1);
        if ($scope.items.length == 0) {
            $scope.items.push({country:'Canada'});
            $timeout(function() {
                utils.calendarPop();
                utils.setDirty();
            }, 0);
        } else {
            $timeout(function() {
                utils.setDirty();
            }, 0);
        }
    };
    
    $scope.setPrimary = function(item) {
        _($scope.items).each(function(i){
            if (i != item) {
                i.primary = false;
            }
        });
        //item.primary = !item.primary;
    };
}])

.controller('propAdminCtrl', function ($scope, $http, context, modela) {
    $scope.sysprops = modela.model;
    $scope.lockedprop = null; 
    	
    $scope.save = function (sysprop) {
    	if(sysprop.oldValue == sysprop.propValue)  		return;
    	
        $http.post(context + '/protected/administration/sysprop/save', {
            
            	propName:  sysprop.propName,
            	propValue: sysprop.propValue
           
        }).then(function (resp) {
            if(resp.data){
            	sysprop.updated = true;
            	$scope.lockedprop = null;
        		sysprop.locked = false;
            }
        }, function (err) {
            alert('save failed - ' + err);
        }).then(function(){
        });
    };
    
    $scope.cancel = function(sysprop){
    	$scope.lockedprop = null;
		sysprop.locked = false;
		sysprop.propValue = sysprop.oldValue;
		
    }
    
    $scope.dbclick = function(sysprop){
    	if(!$scope.lockedprop && sysprop.propName.substring(0,1) !== '*'){
    		$scope.lockedprop = sysprop;
    		sysprop.locked = true;
    		sysprop.oldValue = sysprop.propValue;
    	}else if(sysprop.locked){
    		
    		//$scope.lockedprop = null;
    		//sysprop.locked = false;
    	}
    }
})
.controller('idConfirmCtrl',function($scope,$http,context,model){
	$scope.userinfo = model.userInfo;
	$scope.valid = false;
	$scope.validateCnt = 0;
	$scope.pid = "na";
	$scope.wip = true;
	$scope.showRetryMsg = false;
	//$scope.showFailMsg = false;
	
	$scope.getPid = function(){
	   $http.get(model.pidUrl).then(function(resp){
		   html = resp.data;
		   var p = /HTTP_PID:([^\<]+)\</g
		   var match = p.exec(html);
		   
		   if(match){
			    $scope.pid = match[1].trim();
		   }
		   
		   $scope.wip = false;
	   })	;
	}
	
	$scope.validate = function(){
		$scope.wip = true;	
		$scope.showRetryMsg = false;
		$http.post(context + '/gate/idConfirmCheck', {
            
			firstName:  $scope.userinfo.firstName,
			lastName:   $scope.userinfo.lastName,
			email   :   $scope.userinfo.email,
			loginId :   $scope.pid
       
    }).then(function (resp) {
        if(resp.data.statusCode){
        	$scope.valid = true;
        	location.href= resp.data.data;
        }else{
        	$scope.valid = false;
        }
    }, function (err) {
    	alert (err);
    }).then(function(){
    	$scope.validateCnt++;
    	$scope.wip = false;
    	if($scope.validateCnt < 3 && !$scope.valid){
    		$scope.showRetryMsg = true;
    	}
    });
	}
	
	$scope.getPid();
	
	$("#homelink , #langlink,#myproflink").attr('href','#');
	$("#langlink").attr('onclick','');

})
.directive('oinpTooltip',function(){
	return {
        restrict: 'E',
        template: '<button type="button" class="btn btn-info btn-xs" style="margin-left:10px" ><span class="glyphicon glyphicon-info-sign"></span> {{label}}</button><div class="hide" ng-transclude></div>',
        transclude:true,
        controller:function($scope,$transclude){
          $transclude(function(clone,scope){
             $scope.helptext=clone.html();
          });
        }
        , 
        link: function (scope, el, attrs) {
            scope.label = attrs.popoverLabel;
            
            scope.text = scope.helptext;
          //  console.log(text)
            $(el).popover({
                trigger: 'click',
                html: true,
                content: function() { return scope.text; },
                placement: attrs.popoverPlacement
            });
            
        }
    };
})
.controller('regBatchAdminCtrl', function ($scope, $http, context, $interval, $filter, model ,FileSaver, Blob) {
	$scope.batchDisabled = model.batchDisabled;
	$scope.start = new Date();
	$scope.end   = new Date();
	
	$scope.export = function () {
	    	
		var uri =  '/protected/itsupport/nmas/export?start='+  $filter('date')($scope.start,'dd/MM/yyyy')
		+ '&end=' +  $filter('date')($scope.end,'dd/MM/yyyy')
		  ;
		var param ={


		}
		
		$http.get(context + uri)
		     .success(function(result, status, headers, config) {
		    	    var type = headers('Content-Type');
		            var disposition = headers('Content-Disposition');
		            if (disposition) {
		                var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
		                if (match[1])
		                    defaultFileName = match[1];
		            }
		            defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
		            var blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
		            FileSaver.saveAs(blob, defaultFileName);
		     })
		    .error(function(result, status, headers, config) {
			    console.log(status)  
		    });		
		
		 
	 };
})
.controller('capAdminCtrl', function ($scope, $http, context, $interval, model) {
    $scope.streamCapList = model;
    $scope.gateSessionStats = {};
    $scope.bAutoSessionStats = false;
    
    var stoptime;
    
    $scope.getGateSessionStats = function () {
    	
    	
        $http.get(context + '/protected/itsupport/gateSessionStats')
         .then(function (resp) {
            if(resp.data){
            	$scope.gateSessionStats = resp.data;
            }
        }, function (err) {
            alert('error - ' + err);
            $scope.bAutoSessionStats = false;
        }).then(function(){
        });
    };
    
    $scope.gateCapStats = function () {
    	
    	
        $http.get(context + '/protected/itsupport/capStats')
         .then(function (resp) {
            if(resp.data){
            	$scope.streamCapList = resp.data.model;
            }
        }, function (err) {
            alert('error - ' + err);
        }).then(function(){
        });
    };
    
    $scope.getGateSessionStats();
    $scope.gateCapStats ();
    
    $scope.refreshCapStats = function(){
    	$scope.gateCapStats();
    }
    
    $scope.autoSessionStats = function(){
    	if(stoptime) $interval.cancel( stoptime );
    	
    	$scope.bAutoSessionStats = !$scope.bAutoSessionStats;
    	if(!$scope.bAutoSessionStats){
    		
    	}else{
    		$scope.getGateSessionStats();
    		
    		
    	    stoptime = $interval(function() {
    		   $scope.getGateSessionStats();
		    }, 30000);
    	}
    }
    
    
    
    
})
.factory('PagerService', function () {
	  // service definition
    var service = {};

    service.GetPager = GetPager;

    return service;

    // service implementation
    function GetPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;

        // default page size is 10
        pageSize = pageSize || 5;

        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);

        var startPage, endPage;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        var pages = _.range(startPage, endPage + 1);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
     
})

.controller('pnpMainCtrl',function($rootScope,$scope, $filter,$http,context,PagerService,model){
	
	var vm = this;

	vm.pageItems =  model.applicationList;
    
	vm.pager = {};
	vm.setPage = setPage;
       
	$scope.pnpUser = model.pnpUser;
	$scope.myRep   = model.myRep;
	$scope.errorMessage = null;
	
	$scope.sortType = 'fileNumber';
	$scope.sortReverse = false;
	
	$scope.selectedApplication = null;
	$scope.selectedCase = { caseId : null };
	$scope.wip = false;
	
	$scope.setSelectedApplication = function (application) {
	   $scope.selectedApplication = application;
	   $scope.selectedCase.caseId = application.caseId;
	   $scope.getCaseRep(application);
	};
	
	
	$scope.getMyApps = function(){
	   $http.get(context + '/rest/pnp/main/open').then(function(resp){
		   html = resp.data;
		   var p = /HTTP_PID:([^\<]+)\</g
		   var match = p.exec(html);
		   
		   if(match){
			    $scope.pid = match[1].trim();
		   }
		   
		   $scope.wip = false;
	   })	;
	}
	
	$scope.sort = function(sortby){
		$scope.sortType = sortby;
		vm.pageItems  = $filter('orderBy')(model.applicationList, sortby, $scope.sortReverse);
		$scope.sortReverse = !$scope.sortReverse;
		vm.setPage(1);
	}
	
	function setPage(page){
        if (page < 1 || page > vm.pager.totalPages) {
            return;
        }

        // get pager object from service
        vm.pager = PagerService.GetPager(vm.pageItems.length, page);

        // get current page of items
        vm.items = $scope.vm.pageItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
    }
	 
	$scope.getCaseRep = function(application){
		$scope.wip = true;

		$http.get(context + '/rest/pnp/main/getCaseRep/' + application.caseId).then(function(resp){
			if(resp.data.statusCode){
				$scope.myRep = resp.data.data;
				if(application.caseSubType=="EOI-Entrepreneur" || application.caseSubType=="Entrepreneur"){
					$scope.myRep.bentPnp = true;
				}else{
					$scope.myRep.bentPnp = false;
				}
				
			}else{
				$scope.errorMessage = resp.data.message;
			}
			
			$scope.wip = false;

	    })	;
	}
	
	$scope.withdraw = function(application){
		$scope.errorMessage = null;

		$('#withdrawDlg button#btnWithdraw').one('click',function(){
		     console.log(application.caseId);
		     

		     $scope.doWithdraw(application);
		});
		
		$('#withdrawDlg').modal('show');
		$('#withdrawDlg').on('shown.bs.modal', function () {
		    $('#withdrawDlg p').first().focus();
		})  
	}
	
	$scope.doWithdraw = function(application){
		$scope.wip = true;

		$http.post(context + '/rest/pnp/main/withdraw/' + application.caseId).then(function(resp){
			if(resp.data.statusCode){
				var newApp = resp.data.data;
				if(!!newApp.caseId ){
					application.status = newApp.status;
					application.withdrawFlag = newApp.withdrawFlag;
					application.statusDesc = newApp.statusDesc;
				}
				
			    $('#withdrawDlg').modal('hide');


			}else{
				$scope.errorMessage = resp.data.message;
			}
	    })
	    .then(function(){
			$scope.wip = false;
	    });
	}
	
	$scope.cancelRep = function(repId){
		$scope.errorMessage = null;

		$('#cancelRepDlg button#btnCancelRep').one('click',function(){

		     $scope.doCancelRep(repId);
		});
		
		$('#cancelRepDlg').modal('show');
	}
	
	$scope.doCancelRep = function(repId){
		$scope.wip = true;
		$http.post(context + '/rest/pnp/main/cancelRep/' + $scope.selectedApplication.caseId +'/' + repId).then(function(resp){
			if(resp.data.statusCode){
		
				$scope.getCaseRep($scope.selectedApplication);
				
			    $('#cancelRepDlg').modal('hide');

			}else{
				$scope.errorMessage = resp.data.message;
			}
			
			$scope.wip = false;
	    })	;
	}
	
	$scope.authorize = function(caseId, contactId){
		$scope.errorMessage = null;

		$('#authRepDlg button#btnAuthRep').one('click',function(){

		     $scope.doAuthorize(caseId, contactId);
		});
		
		$('#authRepDlg').modal('show');
	}
	
	$scope.doAuthorize = function(caseId, contactId){
		$scope.wip = true;
		$http.post(context + '/rest/pnp/main/authorizeRep/' + caseId +'/' + contactId).then(function(resp){
			if(resp.data.statusCode){
				$scope.getCaseRep($scope.selectedApplication);
				$('#authRepDlg').modal('hide');
			}else{
				$scope.errorMessage = resp.data.message;
			}
			
			$scope.wip = false;
	    })	;
	}
	 
	
	vm.setPage(1);
	
	
	$("#homelink ").attr('href','#');
	//$("#langlink").attr('onclick','');

})

.controller('pnpRepMainCtrl',function($rootScope,$scope, $filter,$http,context,PagerService,model){  //rep main
 	var vm = this;

	vm.pageItems1 =  {};
	vm.pageItems2 =  {};
	vm.pageItems0 =  {};
    
	vm.pager1 = {};
	vm.pager2 = {};
	
	vm.setPage1 = setPage1;
	vm.setPage2 = setPage2;
    vm.lazyloadPage = lazyloadPage;
    
	$scope.pnpUser = model.pnpUser;
	$scope.errorMessage = null;
	
	$scope.sortType1 = 'fileNumber';
	$scope.sortType2 = 'fileNumber';
	$scope.sortReverse1 = false;
	$scope.sortReverse2 = false;
	
 	$scope.selectedApplicant = {id: null};
 	$scope.selectedApplicant1 = null;
	$scope.wip = false;
	$scope.applicantRequireDoc = false;
	$scope.applicantIconEnable = false;
	
	$scope.selectedApplication = null;
 
	$scope.searchBy = 'lastName';
	$scope.searchTerm = '';
	
	
	$scope.setSelectedApplicant = function (applicant) {
	   if ($scope.selectedApplicant1 && $scope.selectedApplicant1.id == applicant.id) return;
	   
	   $scope.selectedApplicant.id = applicant.id;
	   vm.items2 = [];
	   $scope.onSelectApplicant(applicant);
 	};
 	
 	 
 	
    $scope.selectApplication = function(app){
 	   $scope.selectedApplication = app;
 	   //onsole.log(app)
    }
  
    
 	$scope.onSelectApplicant = function(applicant){
 		
 		
 		$scope.selectedApplicant1 = applicant;
 		 $scope.wip = true;
 		 
 		 $http.get(context + '/rest/pnp/main/repapplicantion/' + applicant.id).then(function(resp){
 			   
 			   vm.pageItems2 = resp.data.data;
 			   vm.setPage2(1);
 			   
 			   if(resp.data.data.length > 0){
 				   $scope.selectedApplication = resp.data.data[0];
 				   
 			   }
 			   
 			   $scope.wip = false;
 		   })	;
 	}
	
	$scope.getMyApplicants = function(){
	   $scope.wip = true;
	   $http.get(context + '/rest/pnp/main/repapplicants').then(function(resp){
		   
		   vm.pageItems1 = resp.data.data;
		   vm.pageItems0 = resp.data.data;
		   vm.setPage1(1);	   
		   $scope.wip = false;
	   })	;
	}
	
	
	 
	
	$scope.sort1 = function(sortby){
		$scope.sortType1 = sortby;
		vm.pageItems1  = $filter('orderBy')(vm.pageItems1, sortby, $scope.sortReverse1);
		$scope.sortReverse1 = !$scope.sortReverse1;
		vm.setPage1(1);
	}

	$scope.sort2 = function(sortby){
		$scope.sortType2 = sortby;
		vm.pageItems2  = $filter('orderBy')(model.applicationList, sortby, $scope.sortReverse2);
		$scope.sortReverse2 = !$scope.sortReverse2;
		vm.setPage2(1);
	}

	
	
	function setPage1(page){
		
		vm.items2 = [];
		$scope.selectedApplicant = {};
		$scope.selectedApplicant1 = null;

        // get pager object from service
        vm.pager1 = PagerService.GetPager(vm.pageItems1.length, page);
        
        if (page < 1 || page > vm.pager1.totalPages) {
        	vm.items1 = [];
            return;
        }
        // get current page of items
        var items3 = $scope.vm.pageItems1.slice(vm.pager1.startIndex, vm.pager1.endIndex + 1);
        
        vm.lazyloadPage(items3);
    }
	
	function lazyloadPage(items) {
		    vm.items1 = items;
		    if(items.length){
				$scope.wip = true;
				$http.post(context + '/rest/pnp/main/lazyloadapplicants', items).then(function(resp){
					   
					   vm.items1 = resp.data.data;
					   $scope.wip = false;
				   })	;
		    }
	}
	
	function setPage2(page){

        // get pager object from service
        vm.pager2 = PagerService.GetPager(vm.pageItems2.length, page);
        
        if (page < 1 || page > vm.pager2.totalPages) {
        	vm.items2 = {};
            return;
        }

        // get current page of items
        vm.items2 = $scope.vm.pageItems2.slice(vm.pager2.startIndex, vm.pager2.endIndex + 1);
    }
	 
	$scope.search = function(){
		if($scope.searchBy == 'filenum'){
			vm.pageItems1 = [];
			$scope.wip = true;
			$http.post(context + '/rest/pnp/main/searchRepApplication', $scope.searchTerm).then(function(resp){
				   
				   var resultLogins = resp.data.data;
				   var result = [];
					angular.forEach($scope.vm.pageItems0, function(pa){
						  if(($filter('filter')(resultLogins, pa.id)).length){
							  result.push(pa);
						  }
					});
					
					vm.pageItems1 = result;
					vm.setPage1(1);

				    $scope.wip = false;
			   })	;
			
		}else{
			var result = [];
			angular.forEach($scope.vm.pageItems0, function(pa){
				 if($scope.searchBy == 'firstName' || $scope.searchBy == 'lastName' || $scope.searchBy == 'email'){
					 if (pa[$scope.searchBy] && pa[$scope.searchBy].toLowerCase().indexOf($scope.searchTerm.trim().toLowerCase()) !== -1) {
						 result.push(pa);
					 }
				 }
			});
			
			vm.pageItems1 = result;
			vm.setPage1(1);

		}
		
	}
	 
	$scope.clearSearch = function(){
		  $scope.searchTerm = null;
		  vm.pageItems1 = vm.pageItems0;
		  vm.setPage1(1);	 
	}
	
	$scope.withdraw = function(application){
		$scope.errorMessage = null;

		$('#withdrawDlg button#btnWithdraw').one('click',function(){
		     console.log(application.caseId);
		     

		     $scope.doWithdraw(application);
		});
		
		$('#withdrawDlg').modal('show');
	}
	
	$scope.doWithdraw = function(application){
		$scope.wip = true;

		$http.post(context + '/rest/pnp/main/withdraw/' + application.caseId).then(function(resp){
			if(resp.data.statusCode){
				var newApp = resp.data.data;
				if(!!newApp.caseId ){
					application.status = newApp.status;
					application.withdrawFlag = newApp.withdrawFlag;
					application.statusDesc = newApp.statusDesc; 
					application.repWithdrawFlag = newApp.repWithdrawFlag ;
				}
				
			    $('#withdrawDlg').modal('hide');


			}else{
				$scope.errorMessage = resp.data.message;
			}
	    })
	    .then(function(){
			$scope.wip = false;
	    });
	}
	
  
//	vm.setPage(1);
	
	$scope.getMyApplicants();
	
	
	$("#homelink ").attr('href','#');
	//$("#langlink").attr('onclick','');

})

.controller('pnpMyProfileCtrl',function($rootScope,$scope, $filter,$http,context,PagerService,model){
	$scope.wip = false;
    $scope.myprofile = model.myprofile;
    $scope.errorMessage = model.errorMessage;
    
    var northamericaCountries = ['American_Samoa',
'Anguilla',
'Antigua_and_Barbuda',
'Bahamas',
'Barbados',
'Bermuda',
'Virgin_Islands_(British)',
'Canada',
'Cayman_Islands',
'Dominica',
'Dominican_Republic',
'Grenada',
'Guam',
'Jamaica',
'Montserrat',
'Northern_Mariana_Islands',
'Puerto_Rico',
'St._Maarten/St._Martin',
'St._Kitts_and_Nevis',
'St._Lucia',
'St._Vincent_and_the_Grenadines',
'Trinidad_and_Tobago',
'Turks_and_Caicos_Islands',
'USA',
'Virgin_Islands_(U.S.)'];
    
    $scope.init = function(){
    	 $('#email').focus();  
    }
    
    $scope.isNorthAmerica = function(country){
    	return northamericaCountries.filter(function(item){
    		return item == country;
    	}).length;
    }
    
    $scope.update = function(){
    	$scope.saved = false;
    	
    	if(!$scope.userForm.$valid) return;
    	$scope.wip = true;
		$http.post(context + '/rest/pnp/main/updateProfile' , $scope.myprofile).then(function(resp){
			if(resp.data.statusCode){
			    $scope.saved = true;
			}else{
				$scope.errorMessage = resp.data.message;
			}
			
			$scope.wip = false;
			$scope.userForm.$setPristine();
	    })	;
    }
    
    $scope.back = function(){
    	location.href = location.href.substr(0, location.href.lastIndexOf("pnp")) + "pnp/main"; 
    	//location.href = location.href.replace('myprofile','main');
    }
	
    $scope.validMyProfile = function(){
    	return $scope.userForm.$valid && $scope.validatePhone($scope.myprofile.homePhone)
    	   && $scope.validatePhone($scope.myprofile.workPhone)
    	   && $scope.validatePhone($scope.myprofile.mobilePhone);
    	   
    }
    

    $scope.validatePhone = function(phone){
    	if(!phone) return true;
    	
    	if($scope.myprofile.bRep){
        	return  phone.length == 10 ? phone.match(/^(?!\+).+/)  :  phone.match(/^\+.+/);

    	}else{
    	  if($scope.isNorthAmerica($scope.myprofile.countryOfResidence)) return phone.length == 10 && phone.match(/^(?!\+).+/) != null;
    	
    	   return   phone.match(/^\+.+/)  != null;
    	}
    }
    
    $scope.init();
})
.controller('welcomeCtrl',function($scope,$http,context,model){
	$scope.pid = "na";
	$scope.wip = true;
	
	$scope.getPid = function(){
	   $http.get(model.pidUrl).then(function(resp){
		   html = resp.data;
		   var p = /HTTP_PID:([^\<]+)\</g
		   var match = p.exec(html);
		   
		   if(match){
			    $scope.pid = match[1].trim();
			    
			    $scope.setPid();
		   }
		   
	   })	;
	}
	
	
	$scope.setPid = function(){
		
		$http.post(context + '/pnp/setpid' , {loginId : $scope.pid}).then(function(resp){
			if(resp.data.statusCode){
				   $scope.wip = false;
			}else{
				$scope.errorMessage = resp.data.message;
			}
			
	    })	;
	}
	
    $("#homelink , #langlink, #myproflink").attr('href','#');
    $("#langlink").attr('onclick','');
    
	$scope.getPid();
	
	$scope.goNext = function(){
		 location.href = model.mainUrl;
	}
	
	
	setTimeout(function(){
		$('#welcomeDiv').focus();
	},50);
	
	$('#skipNav').click(function(){
		$('#welcomeDiv').focus();
	})

})

.controller('pnpAddAppCtrl',function($rootScope,$scope, $filter,$http,context,PagerService,model){
 	
	var vm = this;

	vm.pageItems =  {};
    
	vm.pager = {};
	vm.setPage = setPage;

	$scope.searched = false;
	
	$scope.searchRequest = {
			fileNum: null,
			email  : null
	}
	
	$scope.pnpUser = model.pnpUser;
	 
	$scope.errorMessage = null;
	
	$scope.sortType = 'fileNum';
	$scope.sortReverse = false;
	
	$scope.selectedApplication = null;
 	$scope.wip = false;
 	$scope.result = false;
 	$scope.errorCapHasRep = false;
 	
	$scope.setSelectedApplication = function (application) {
	   $scope.selectedApplication = application;
	  
 	};
	
	

	
	$scope.sort = function(sortby){
		$scope.sortType = sortby;
		vm.pageItems  = $filter('orderBy')(model.applicationList, sortby, $scope.sortReverse);
		$scope.sortReverse = !$scope.sortReverse;
		vm.setPage(1);
	}
	
	function setPage(page){

        // get pager object from service
        vm.pager = PagerService.GetPager(vm.pageItems.length, page);

        if (page < 1 || page > vm.pager.totalPages) {
            return;
        }

        // get current page of items
        vm.items = $scope.vm.pageItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
    }
	 
	$scope.clear = function(){
	    $scope.searchRequest = {
				fileNum: null,
				email  : null
		};
	    
	    $scope.userForm.$setPristine();
	    $scope.searched = false;			
	    $scope.result = false;
	    $scope.errorCapHasRep = false;
	}
	
	$scope.search = function(application){
		$scope.wip = true;
        $scope.result = false;
        $scope.errorCapHasRep = false;
		$http.post(context + '/rest/pnp/main/existingapps' , application ).then(function(resp){
			if(resp.data.statusCode){
				vm.pageItems = resp.data.data;
				$scope.result = vm.pageItems.length > 0;
				
				vm.setPage(1);
				$scope.searched = true;
			}else{
				$scope.errorMessage = resp.data.message;
			}
			
			$scope.wip = false;

	    })	;
	}
	
	$scope.addapp = function(application){
		if(application.hasRep){
			$scope.errorCapHasRep = true;
			return;
		}
		
		$scope.errorCapHasRep = false;
		$scope.errorMessage = null;

		$('#addappDlg button#btnAddapp').one('click',function(){
		     console.log(application.caseId);
		     

		     $scope.doAddApp(application);
		});
		
		$('#addappDlg').modal('show');
	}
	
	$scope.doAddApp = function(application){
		$scope.wip = true;

		$http.post(context + '/rest/pnp/main/repaddapp', application ).then(function(resp){
			if(resp.data.statusCode){
				//$scope.myRep = resp.data.data;
				location.href= oinpContextRoot +   '/pnp/main' ;  //'/oinp_enu/dynamicform/pnp/main';
				
			}else{
				$scope.errorMessage = resp.data.message;
			}
			
			$scope.wip = false;

	    })	;
	}
	

	 

})

.controller('paymentCtrl',function($rootScope,$scope, $filter,$http,context,model){
	$scope.payform = model.paymentForm;
	$scope.mode = model.mode;
	$scope.errorMessage = model.error;
	
	$scope.wip = false;

	$scope.print = function(){
		window.print();
	}
	
	$scope.close = function(){
		$scope.back();
	}
	
	$scope.back = function(){
		location.href =  oinpContextRoot +  '/pnp/main' ; // '/oinp_enu/dynamicform/pnp/main';
	}
	
	
	$scope.paynow = function(){
		$scope.wip = true;
		$scope.errorMessage = null;
		
		$http.post(context + '/rest/pnp/paynow/' + $scope.payform.caseId ).then(function(resp){
			if(resp.data.statusCode){
				//$scope.myRep = resp.data.data;
				location.href= resp.data.data;
				
			}else{
				$scope.errorMessage = resp.data.message;
			}
			
			$scope.wip = false;

	    })	;
	}
})
 
.controller('selectStreamCtrl',function($rootScope,$scope, $filter,$http,context,model){
	$scope.dest = '#';
	$scope.wip = false;
	$scope.lastEle = null;
	
	 $scope.select1 = function(link, item){
		 $scope.dest = link;
		 
		 $scope.lastEle = item.currentTarget;
		 
		 var streamDesc = angular.element(item.currentTarget).text();  
		 $('#confirmDlg').modal('show');
		 $scope.streamDesc = streamDesc.replace('<br>','');
		 
		 $('#confirmDlg').on('shown.bs.modal', function (e) {
		   setTimeout( function() { $('#popupbody ' ).focus(); } , 50);
		 });
		 
		 return false;
	 }
	 
     $scope.yes = function( ){
		// $('#confirmDlg').modal('hide');
    	 $scope.wip = true;
    	 location.href = $scope.dest ;
     }		
     
     $scope.cancel = function(){
		 $scope.dest = '#'

		 $('#confirmDlg').modal('hide');
		 
		 setTimeout( function() { $($scope.lastEle ).focus(); } , 50);
     }	
     
     $scope.tabTop = function(){
    	 setTimeout( function() { $('#popupbody ' ).focus(); } , 50);
     }
})


.controller('pnpDocRequestCtrl',function($rootScope,$scope, $sce, $filter,$http, FileUploader,context,model){
	/*1-Action Required
	3-Request Cancelled
	4-Request Completed
	2-Request Expired
	*/
	var uploader = $scope.uploader = new FileUploader({ 
		
	});
	  
	$scope.docRequstResponse = {};
	$scope.drItems = [];
	$scope.dest = '#';
	$scope.wip = true;
	$scope.currentDocReq = null;
	$scope.requestType = '';
	
	$scope.toggle= function(dr){
	   dr.show = !dr.show;	
	}
	
	$scope.disableSubmit = function(dr){
		return dr.readOnly ;
	}
	
	$scope.validateFileNameSize = function(fileItem, balert){
		var maxSize = 10;
		var item = fileItem.file;
    	var ext = item.name.match(/\.([^\.]+)$/)[1];
		if(ext) ext = ext.toLowerCase();
		switch(ext)
		{
			case 'doc':
			case 'docx':
			case 'pdf':
			case 'xls':
			case 'xlsx':
			case 'csv':
			case 'ppt':
			case 'pptx':
			case 'rtf':
			case 'txt':
			case 'jpeg':
			case 'bmp':
			case 'png':
			case 'gif':
			case 'tiff':
			case 'jpg':
				 break;
			default:
				if(balert) alert("This type of file is not allowed!");
			    return false;
				 
		}
		if (item.size > maxSize * 1024 *1024) {
			if(balert) alert("This file exceeds "+maxSize+" MB size!");
		    return false;
		}
		
		
		return true;
	}
	
	$scope.loadDocRequests = function(caseId){
		blockingUI();
		
		$http.post(context + '/rest/pnp/main/listDocRequsts/' + model.caseId , {} ).then(function(resp){
			
			if(resp.data.statusCode == 1){
				$scope.docRequstResponse = resp.data.data;
				$scope.drItems = $scope.docRequstResponse.docRequests;
				
				
				angular.forEach($scope.drItems, function(value){
					value.show = false;
					
					value.more = false;
					if(value.instructions){
						var words = value.instructions.split(' ');
						if(words.length > 100) {
							value.more = true;
							value.instructionShort = $sce.trustAsHtml("<p>"+ words.slice(0,99).join(' ') .replace(/(\r\n|\n|\r)/g,"<br />") + "...</p>");	
						}
						value.instructions = $sce.trustAsHtml("<p>"+value.instructions .replace(/(\r\n|\n|\r)/g,"<br />") + "</p>");
					}
					
					if(value.requestType == 'Confirmation') {
						$scope.requestType = 'Confirmation';
					}
				});
				
			}else{
				$scope.errorMessage = resp.data.message;
			}
			
			$scope.wip = false;
			$.unblockUI();
	    })	;
	}
	
	$scope.isFileValid = function() {
		
		var items = uploader.getNotUploadedItems (); 
		if(items.length == 1 && $scope.validateFileNameSize(items[0],false)) {
			 return true;
		} 
		 
		return false;
	}
	
	$scope.uploadDialog = function(dr) {
		$('#file_source').val(null);
		$('#comments').val('');
		 $scope.currentDocReq =  dr;
		 $('#uploadModal').modal('show');
	} 
	
	$scope.showFullMsg = function(dr) {
		 $scope.currentDocReq =  dr;
		 $('#textDlg').modal('show');
	}
	
	$scope.upload = function() {
		 if(!$scope.isFileValid()) return;
		 
		 var dr = $scope.currentDocReq;
		 uploader.onBeforeUploadItem  = function(item) {
			
		       item.url = context + '/appform/docrequest/upload/' + model.caseId + '/' + dr.requestId;
		       item.formData = [{comments : $('#comments').val()}]
			 
		 } ;
		
		 uploader.onErrorItem    = function(item, response, status, headers ) {
			 $scope.error( status)
		 } ;
		 
		 uploader.onSuccessItem     = function(item, response, status, headers ) {
			 if(response.statusCode == 1){
				   dr.documents.push(response.data);
			 }else{
				 $scope.error(response.message);
			 }
		 } ;
		 
	     uploader.onCompleteAll   = function( ) {
	    	 $scope.wip = false;
	    	 $scope.cancelDialog();
		 } ;
		 
		 $scope.wip = true;
		 
		uploader.uploadAll();
		
		
	}
	
	$scope.error = function (errMsg){
		alert(errMsg);
	}
	
	$scope.deleteDoc = function (appDoc, dr,appDoc, msg){
		if (confirm(msg) == true) {
			$scope.wip = true;
			
			$http.post(context + '/appform/docRequsts/delete/' + model.caseId + '/' +  dr.requestId + '/' + appDoc.id , {} ).then(function(resp){
				
				if(resp.data.statusCode == 1){
					var dr1 = resp.data.data;
					dr.statusCode = dr1.statusCode;
					dr.readOnly = dr1.readOnly;
					
					var p = -1;
					angular.forEach(dr.documents, function(value, index){
						if ( value.id == appDoc.id ){
							p = index;
						}
					});
					
					if(p >= 0){
						dr.documents.splice(p, 1); 
					}
					
				}else{
					$scope.errorMessage = resp.data.message;
					$scope.error($scope.errorMessage);
				}
				
				$scope.wip = false;

		    })	;

	    	
	    } else {
	    	
	    }
	}
	
	$scope.cancelDialog = function() {
		uploader.clearQueue();
	    $('#uploadModal').modal('hide');

	}
	
	$scope.submit = function(dr){
		$scope.currentDocReq =  dr;
		$('#confirmDlg').modal('show');
	}
	
	$scope.doSubmit = function(){
		
	    var dr = $scope.currentDocReq;
		
		$scope.wip = true;
		
		$http.post(context + '/rest/pnp/main/docRequsts/submit/' + model.caseId + '/' +  dr.requestId  , {} ).then(function(resp){
			
			if(resp.data.statusCode == 1){
				var dr1 = resp.data.data;
				dr.statusCode = dr1.statusCode;
				dr.readOnly = dr1.readOnly;
				
				
			}else{
				$scope.errorMessage = resp.message;
				$scope.error(resp.message);
			}
			
			$scope.wip = false;
			$('#confirmDlg').modal('hide');
		});
		
	}
	
	
	$scope.loadDocRequests(model.caseId); 
})



;
