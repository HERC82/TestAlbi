$.effects.effect.slide=$.effects.effect.slide||function(e,t){var n=$(this),r=["position","top","bottom","left","right","width","height"],i=$.effects.setMode(n,e.mode||"show"),s=i==="show",o=e.direction||"left",u=o==="up"||o==="down"?"top":"left",a=o==="up"||o==="left",f,l={};$.effects.save(n,r);n.show();f=e.distance||n[u==="top"?"outerHeight":"outerWidth"](true);$.effects.createWrapper(n).css({overflow:"hidden"});if(s){n.css(u,a?isNaN(f)?"-"+f:-f:f)}l[u]=(s?a?"+=":"-=":a?"-=":"+=")+f;n.animate(l,{queue:false,duration:e.duration,easing:e.easing,complete:function(){if(i==="hide"){n.hide()}$.effects.restore(n,r);$.effects.removeWrapper(n);t()}})}
$.bf = $.bf || {};
$.bf.globalReload = false;

function capitalize( toUpc ) {
	if( !toUpc || typeof toUpc != 'string' )
		return '';
		
	return toUpc.slice( 0, 1 ).toUpperCase() + toUpc.slice( 1 ).toLowerCase();
}

var preloadData,
	analisiSpeseRqData,
	elencoMovimentiCategoria,
	asComposizioneRq,
	dataBudgetAutoRq,
	posCategoria,
	idCategoria,
	eventData = {
		tipoMov: function(){ return $("#scelta-tipo-mov").val() },
		idCategoria: function(){ return $("#scelta-categoria").val() 
		//idCategoria: function(){ return $("#catIndexValue").val()		
		}

	};

var widgetsNaming = [["w01","sintesi-conto"],["w02","analisi-spese"],["w03","budget"],["w04","spese-contante"],["w05","spese-brand"],["w06","analisi-spese-dettaglio-categoria"]];

var widgetErrorHtml = "<div class='pal widgetError'><h2 class='mvl red'>Attenzione, si è verificato un errore</h2><div class='mvl'>Si prega di riprovare più tardi.</div><div class='float-right'><a href='#' class='reloadWidget btn-big btn-orange'>Ricarica il Widget</a></div><div class='clear'></div></div>"

function widgetCreate(widgetName, widgetSize, widgetFullName, widgetPosition, widgetParams, widgetModify, widgetLink, widgetLinkClass){
	var modifyButton
	var linkButton = ""
	widgetParams == null ? widgetParams ='' : widgetParams = widgetParams ;
	widgetModify == true ? modifyButton = '<a href="#fin-widget-modify" class="fin-widget-icon modify float-right mrl">Filtri</a>' : modifyButton = ""
	if(widgetLink != null && widgetLink != "" && widgetLinkClass != null && widgetLinkClass != ""){
		linkButton = '<a class="float-right mrl prevent-default '+widgetLinkClass+'" href="#">'+widgetLink+'</a>'
	}
	$.ajax({
		url: "/conto-e-carte/bilancio-familiare/"+widgetName+widgetParams,
		dataType:"html",
		data: "GET"
		}).
		done(function(data){
			if(widgetPosition != null){		
				if($("#"+widgetName+"").length >=1) {
					$("#"+widgetName+"").closest(".fin-widget").remove();
				}
				$("#"+widgetPosition+"").closest(".fin-widget").after("<div class='fin-widget clearfix'><div class='fin-widget-header clearfix'><h5>"+widgetFullName+"</h5><a class='fin-widget-icon delete' href='#delete'>Elimina</a>"+modifyButton+linkButton+"<a class='float-right mrm begin-tutorial prevent-default' href='#wizard'>Guida</a></div>"+data+"</div>");				
			}
			else if(widgetName == "brand-geo"){
				$(".fin-widget-container").append("<div class='fin-widget clearfix splittedWidget'>"+data+"</div>");
				widgetName = "spese-brand"						
			}
			else{
				$(".fin-widget-container."+widgetSize).append("<div class='fin-widget clearfix'><div class='fin-widget-header clearfix'><h5>"+widgetFullName+"</h5><a class='fin-widget-icon delete' href='#delete'>Elimina</a>"+modifyButton+linkButton+"<a class='float-right mrm begin-tutorial prevent-default' href='#wizard'>Guida</a></div>"+data+"</div>");						
			}			
			if(widgetName == "analisi-spese-dettaglio-categoria"){
				$('#'+widgetName+' .select-grafica').not('.delayed-render, .no-render').selectmenu();
				$('#analisi-spese-dettaglio-categoria').closest(".fin-widget").addClass("toggleableWidget1").hide()
				$('#analisi-spese').closest(".fin-widget").addClass("toggleableWidget2");
				
				$(".toggleableWidget2").hide("slide", { direction: "left" }, 500, function(){
					$(".toggleableWidget1").show("slide", { direction: "right" }, 500);
					$("#"+widgetName+"").trigger("widget.load");
				});
			}
			else {
				$("#"+widgetName+"").trigger("widget.load");
				$('#'+widgetName+' .select-grafica').not('.delayed-render, .no-render').selectmenu();	
			}
			$.colorbox.close()
			$("html, body").animate({ scrollTop: ($("#"+widgetName+"").offset().top) - 60 }, 500);
		})
		.fail(function(){});
		
}

var widgetDisp = function(){
			var widgetDisplacement = new Array;
			var thereIsWidget06 = false
			var indexOf02 = null
			$(".fin-widget-content").each(function(index,element){
				for ( i=0; i<widgetsNaming.length; i++)
				{
				if( $(element).attr("id") == widgetsNaming[i][1]){
					widgetDisplacement.push(widgetsNaming[i][0]);
					if($(element).attr("id") == "analisi-spese-dettaglio-categoria"){
						thereIsWidget06 = true
						}
					}
				}
			});
			//check se c'è il widget 06 da trasformare in 02
			if(thereIsWidget06){
				$.each(widgetDisplacement, function(index,value){
					if(value == "w02"){
						indexOf02 = index
					}
				});
				if(indexOf02 != null){
					widgetDisplacement.splice(indexOf02,1);
					$.each(widgetDisplacement, function(index,value){
						if(value == "w06"){
							widgetDisplacement[index] = "w02"
						}
					});
				}
			}
			var widgetDisplacementString = widgetDisplacement.toString()
			return widgetDisplacementString
		}

function deleteChart(id){
	for(var i=0;i<Highcharts.charts.length;i++){
		if(Highcharts.charts[i] && Highcharts.charts[i].renderTo.id == id){
		 Highcharts.charts[i].destroy()
		 Highcharts.charts.splice(i,1)    
		 }
     }
}

function reloadAllWidgets(speseContante,analisiSpese,budget,analisiSpeseDettaglio,sintesiConto){
	$.bf.preloadRq = $.ajax({
		url: '/conto-e-carte/bilancio-familiare/json/preload-data',
		type: 'POST'
	});
	var analisiSpeseUrl = '/conto-e-carte/bilancio-familiare/json/analisi-spese'
	if($("#isEntrateCheck").val()=="true")
	{analisiSpeseUrl = '/conto-e-carte/bilancio-familiare/json/analisi-entrate'}
	$.bf.analisiSpeseRq = $.ajax({
		url: analisiSpeseUrl,
		type: 'POST'
	});
	if(sintesiConto && $("#sintesi-conto").length > 0 ){
		$("#sintesi-conto").trigger("widget.load");
	}
	if(budget && $("#budget").length > 0 ){
		$("#budget").trigger("widget.load");
	}
	if(analisiSpese && $("#analisi-spese").length > 0){
		$("#analisi-spese").trigger("widget.load");
	}
	if(speseContante && $("#spese-contante").length > 0){
		$("#spese-contante").trigger("widget.load");
	}
	if(analisiSpeseDettaglio && $('#analisi-spese-dettaglio-categoria').length > 0){
		$('#analisi-spese-dettaglio-categoria').trigger("widget.load")
	}
}

	function createTipSpese() {		
		$('.tip-spesa-max, .tip-spesa-min, .tip-risparmio-max').qtip({
				position: {
					my: 'bottom center',
					at: 'top center'
				},
				style: {
					classes: "bilancio-familiare-tip auto",
					tip: {
						width: 15,
						height: 8
					}
				},		
			   content: {
				  text: function( evt, api ) {
					return api.options.content.text =
					$( api.elements.target.attr("href") ).html();						
				  }
			   }
		});		
	}

 var createSliderMM4step = function(){
	 	if($('#moneymap-4step').is(':visible')){
			$('#moneymap-4step').hide();
		} else {
			$('#moneymap-4step').show();
			/*SLIDER INTRO*/
				$('#slider-intro-moneymap').flexslider({
					animation: "slide",
					slideshow: false,
					animationLoop: false,
					itemWidth: 978,
					prevText: "INDIETRO",
					nextText: "AVANTI"			
				});
			/* FINE SLIDER INTRO*/
			 $.ajax({
				url: '/myfineco/preferenze/bf-primoaccesso/1/true'
			})			
		}
}

var SCreloading = false
var filteredValues = []

/* FINE VARIABILI */
	
$(function() {
	// demo 4 step controllo se è un primo accesso	
	var primoAccessoMM = $('#moneymap-4step').data('primoaccesso')
	if(primoAccessoMM == true ){ createSliderMM4step();};	
	$('body').on('click', '.moneymap-4step', createSliderMM4step);	
	
	
	// controllo se ci sono chiamate ajax che vanno in timeout
	$(document).ajaxComplete(function(event, xhr, settings) {
		xhr.always(function(data){
			if($.stripErrors(data).htmlError != undefined){
				if(!$.stripErrors(data).htmlError.match("<li>")){
					$('.qtip:visible').qtip().hide();
				
					$("body").qtip({
						content: {
							text: $.stripErrors(data).htmlError
						},
						position: {
							my: 'center',
							at: 'center',
							target: $(window),
							viewport: $(window)
						},
						show: {
							modal: true,
							ready: true,
							event: false
						}
					});
				}
			} 
		})
    });
	
	// flexslider per la barra dei mesi
	$('.balance-list-container').flexslider({
		animation: "slide",
		slideshow: false,
		itemWidth: 80,
		itemMargin: 1,
		animationLoop: false,
		controlNav: false,
		startAt: 1
		//controlsContainer: '.balance-list-container',
	});
	
	// chiamate ajax per popolare i widget, popolo vari tooltip coi dati via json
	$.bf = $.bf || {};
	$.bf.preloadRq = $.ajax({
        url: '/conto-e-carte/bilancio-familiare/json/preload-data',
        type: 'POST'
    }).done(function(dataPreload){
		preloadData = dataPreload
		if(preloadData.reportTimeframe == null){
			$('.spesa-max-data').text(0); 
			$('.spesa-min-data').text(0); 
			$('.spesa-min-desc').text(0); 
			$('.spesa-max-desc').text(0); 
			$(".categoria-min-desc").text("");
			$(".categoria-max-desc").text(""); 
		}
		else{
			//tooltip SPESA PIU' ALTA/ Bassa
			var dataMaxJSON,
				dataMinJSON,
				descMax,
				descMin,
				categoryMax,
				categoryMin,
				periodoMax
			var isEntrate = $(".widget-btn-switchEntrate").is(".selected")
			if(isEntrate){
				if(preloadData.reportTimeframe.id_categoria_min_entrata != null){
					dataMinJSON = preloadData.reportTimeframe.data_min_entrataJSON
					descMin = preloadData.reportTimeframe.desc_min_entrata
					categoryMin = preloadData.reportTimeframe.id_categoria_min_entrata
				}
				else{
					dataMinJSON = 0
					descMin = ""
					categoryMin = ""
				}
				if(preloadData.reportTimeframe.id_categoria_max_entrata != null){
					dataMaxJSON = preloadData.reportTimeframe.data_max_entrataJSON
					descMax = preloadData.reportTimeframe.desc_max_entrata
					categoryMax = preloadData.reportTimeframe.id_categoria_max_entrata
					periodoMax = preloadData.reportTimeframe.periodo_max_risparmio
				}else{
					dataMaxJSON = 0
					descMax = ""
					categoryMax = ""
					periodoMax = "" 
				}
			}
			else{
				if(preloadData.reportTimeframe.id_categoria_min_spesa != null){
					dataMinJSON = preloadData.reportTimeframe.data_min_spesaJSON
					descMin = preloadData.reportTimeframe.desc_min_spesa
					categoryMin = preloadData.reportTimeframe.id_categoria_min_spesa
				}
				else{
					dataMinJSON = 0
					descMin = ""
					categoryMin = ""
				}
				if(preloadData.reportTimeframe.id_categoria_max_spesa != null){
					dataMaxJSON = preloadData.reportTimeframe.data_max_spesaJSON
					descMax = preloadData.reportTimeframe.desc_max_spesa
					categoryMax = preloadData.reportTimeframe.id_categoria_max_spesa
					periodoMax = preloadData.reportTimeframe.periodo_max_risparmio
				}else{
					dataMaxJSON = 0
					descMax = ""
					categoryMax = ""
					periodoMax = ""
				}
			}
			$('.spesa-max-data').text(dataMaxJSON); 
			$('.spesa-min-data').text(dataMinJSON); 
			$('.spesa-min-desc').text(descMin); 
			$('.spesa-max-desc').text(descMax); 
			if(categoryMin != ""){
			$(".categoria-min-desc").text(preloadData.elencoCategorie[categoryMin].categoria);}
			if(categoryMax != ""){
			$(".categoria-max-desc").text(preloadData.elencoCategorie[categoryMax].categoria);}
		
		//tooltip MAX RISPARMIO MENSILE
		var meseMaxRisparmio = Globalize.parseDate(preloadData.reportTimeframe.periodo_max_risparmio, 'yyyyMM');	
		$('#tip-risparmio-max .risparmio-max-mese').text(capitalize(Globalize.format(meseMaxRisparmio, 'MMMM yyyy')));			
		}
		
	});
	// chiusura dei widget
	$('body').on( 'click', '.fin-widget-icon.delete', function( evt ){
		if($(".fin-widget").length === 1){
			$(this).qtip({
				content: {
					text: $("#tip-conferma-ultimo") 
				},
				style: {
					classes: 'modal-confirm-tip'
				},
				position: {
					my: 'center',
					at: 'center',
					target: $(window),
					viewport: $(window)
				},
				show: {
					modal: true,
					ready: true,
					event: false
				},
				hide: {
					event: 'click',
					target: $('#tip-conferma-ultimo .ultimoChiudi')
				}
			});
			return;
		}
			
		if($("#confermaChiusuraOnOff").val() != "off"){
			$(this).qtip({
				content: {
					text: $("#tip-conferma-cancellazione"),
					title: {
						text: function () {
							return ''
						},
						button: '[chiudi]'
					}				
				},
				style: {
					classes: 'modal-confirm-tip q-colorbox'
				},
				position: {
					my: 'center',
					at: 'center',
					target: $(window),
					viewport: $(window)
				},
				show: {
					modal: true,
					ready: true,
					event: false
				},
				hide: {
					event: 'click'
				}
			});
			var pointerDelete = $(this)
			$("body").on( 'click', '.confirmDelete', function( evt ) {
				var nonChiedermeloPiu = $("#nonChiedermeloPiu").prop("checked");
				if(nonChiedermeloPiu){
					$.ajax({
						url: '/myfineco/preferenze/bf-confermachiusura/off',
						type: 'POST'
					});
				}
				pointerDelete.closest( '.fin-widget' ).fadeOut( 'fast', function(){
					$(this).remove();
				});
				if(pointerDelete.closest( '.fin-widget' ).find("#analisi-spese").length > 0){
					$("#isEntrateCheck").val("false");
				}
				$(this).closest(".qtip.q-colorbox").qtip("hide");
				evt.preventDefault();
			});
		}
		else{
			$(this).closest( '.fin-widget' ).fadeOut( 'fast', function(){
				$(this).remove();
			});
		}
		evt.preventDefault();
	}).on( 'click', '.fin-widget-icon.modify, .fin-widget-icon.modify-done', function( evt ) {
		$( $( this ).attr( 'href' ) ).slideToggle('fast');
		evt.preventDefault();
	}).on( 'change', '#nonChiedermeloPiu', function( evt ) {
		if($(this).prop("checked") == true){ 
			$("#confermaChiusuraOnOff").val("off")
		}
		else{ 
			$("#confermaChiusuraOnOff").val("on")
		}
	}).on( 'click', '.change-timeframe', function(evt){
		$('#timeframe').val($( this ).attr('timeframe'));
		$("#widgetOrder , #widgetOrderMese").val(widgetDisp());
		if ($( this ).attr('timeframe') == "ADV") {
			$('#scelta-timeframe li').removeClass('selected-slot');
			$(this).parent().addClass('selected-slot');
			$('#ricerca-avanzata').show();
		} else if ($( this ).attr('timeframe') == "ALL") {				
			$('#meseInizio').val($("#annomeseInizio option:first").val())
			$('#meseFine').val($("#annomeseFine option:last").val())
			$('#timeframe-mese').val("ALL");
			$('#formTimeframeMese').submit();				
		} else {
			$('#ricerca-avanzata').hide();
			$('form.timeframe').submit();
		}
		
		evt.preventDefault();
	}).on( 'change', '#checkboxCarte', function(evt){
		$('form.timeframe').submit();
	}).on( 'submit', 'form.timeframe', function( evt ) {
		$("#widgetOrder").val(widgetDisp());
		if ($('#timeframe').val() == "ADV" && $('#annomeseInizio').val() > $('#annomeseFine').val()) {
			evt.preventDefault();
			$('#errore-date').text('Impostare un intervallo di date corretto');
		}
	}).on( 'click', '.ui-selectmenu-menu.select-grafica.select-bilancio, .ui-selectmenu-menu.select-grafica.select-bilancio li, .ui-selectmenu-menu.select-grafica.select-bilancio li a', function(event){
		event.preventDefault();
	}).on( 'click', '.confirmCancel', function(){
		$(this).closest('.qtip').qtip('hide');
	});
	
	/* FINECO WIDGET DRAG AND DROP */
	
	// http://tyler-designs.com/masonry-ui/
	$('.fin-widget-container').sortable({
		cancel: ".fin-widget-icon"/*, .nodrag, .fin-widget-container > *:not(.fin-widget),\
			.highcharts-container, input, textarea"*/,
		handle: '.fin-widget-header',
		revert: 140,
		cursor: "move",
		placeholder: "ui-state-highlight fin-widget-drag-over",
		connectWith: ".fin-widget-container",
		tolerance: 'pointer',
		update: function(event, ui){
			//console.log("updated");
			if(ui.item.hasClass("toggleableWidget1")){
				//$(".toggleableWidget2 #grafico-analisi-viewport").data("flexslider").remove()
				$(".toggleableWidget2").insertBefore(ui.item)
			}
		}
	});
	
	/* FUNZIONI SPECIFICHE PER WIDGET */
	
	// vedi js omonimi, page è stato splittato
	
	/* FINE FUNZIONI SPECIFICHE PER WIDGET */
	$("body").on("click", ".movimenti-nascosti-qcolorbox", function(event){
		event.preventDefault();
		var typeVariable = $("#movimenti-nascosti-param").val()
		$(this).qtip({
				content: {
					title: {
						text: function () {
							return '<h2>Movimenti nascosti</h2>'
						},
						button: '[chiudi]'
					},
					text: '<div class="text-align-center loading"></div>',
					ajax: {
						url: '/conto-e-carte/bilancio-familiare/movimenti-nascosti', // URL to the local file
						type: 'POST', // POST or GET
						once: false,
						data: {
							type: typeVariable
						},
						success: function (data) {
							this.set('content.text', data);
							$.initElements.apply(this.elements.content);
							if (this.elements.content.find("div.no-result")
								.length > 0) {
								reloadAllWidgets(true, true, true, true, true)
							}
						}
					}
				},
				show: {
					event: 'click',
					modal: true,
					solo: false
				},
				hide: {
					event: 'click',
					target: $('#qtip-overlay, .qtip-close')
				},
				style: {
					classes: 'q-colorbox q-colorbox-no-scroll'
				},
				position: {
					my: 'center',
					at: 'center',
					viewport: $(window),
					target: $(window)
				},
				events: {
					hide: function (event, api) {
					},
					render: function (event, api) {
						api.elements.content.on("click", "a.inner-nav", { tooltip: api }, $.xhrDispatcher );
						api.elements.content.on("submit validate.submit", "form", { tooltip: api }, $.xhrDispatcher );
					}
				}
		})/*
		.bind('navigate.tooltip.fineco', $.xhrLoader)
		.bind('message.tooltip.fineco', $.xhrMessage)*/
		.qtip("show");
	}).on("change", "#container-tabella-dettaglio-spese #type",function(event){
		$("#movimenti-nascosti-param").val($(this).val());
		$('#ovl-elenco-movimenti-nascosti').submit();
	});
	
	
	$(".widgetConfig").colorbox({
		href: "/conto-e-carte/bilancio-familiare/configura-widget",
		width: 745,
		height: 620,
		onLoad: function(){
			$(".widgetConfig").qtip("hide");
		},
		onComplete: function(){
			var currentWidgets = new Array
			var widgetDisplacement = new Array
			$(".fin-widget-content").each(function(index,element){
				if($(this).attr("id") == "geolocalizzazione" && $(this).hasClass("small")){}
				else{
					currentWidgets.push($(element).attr("id"))
				}
			});
			$(".widget-controller").each(function(index,element){
				var hasModify = false
				var widgetLink = ""
				var widgetLinkClass = ""
				var controllerId = $(element).attr("id");
				controllerId = controllerId.substring(8);
				//if(controllerId == "spese-brand"){controllerId = "brand-geo"}
				if(controllerId == "analisi-spese"){
					hasModify = true
					widgetLink = "Categorie"
					widgetLinkClass = "open-tip-gestione-categorie"
				}
				/*if(controllerId == "analisi-spese"){
					widgetLink = "Gestione categorie"
					widgetLinkClass = "tip-gestione-categorie"
				}*/
				if(controllerId == "budget"){
					widgetLink = "Imposta budget"
					widgetLinkClass = "imposta-budget"
				}
				var widgetActive = false;
				for ( i=0; i<currentWidgets.length; i++)
					{
						if( controllerId == currentWidgets[i]){
							widgetActive = true;
							break
						}
					}
				if(widgetActive == true){
					$(element).find(".widget-control-container").html("<span class='green'>Widget caricato</span><a class='mlm widgetRemove btn-medium btn-black' href='#"+controllerId+"'>Rimuovi</a>")
					}
				else{
					if(controllerId == "spese-brand"){controllerId = "brand-geo"}
					$(element).find(".widget-control-container").html("<a class='widgetAdd btn-medium btn-blue' href='#' data-widget-id='"+controllerId+"' data-widget-name='"+$(element).data("name")+"' data-widget-modify='"+hasModify+"' data-widget-link='"+widgetLink+"' data-widget-link-class='"+widgetLinkClass+"'>Attiva widget</a>")}
				
			});
		}
	});
	
	
	$("body").on("click", ".widgetRemove", function(event){
		event.preventDefault();
		if(($(this).attr("href")=="#spese-brand" && $(".fin-widget-content").length == 2) || $(".fin-widget-content").length <= 1){
			$("#cboxContent .messages-container").html("<div class='boxError mvs'>Attenzione non è possibile rimuovere tutti i widget</div>");	
			$.colorbox.resize();
		}else{
		var additionalLinks = ""
		if($(this).closest(".widget-controller").is("#control-analisi-spese"))
		{additionalLinks = "data-widget-modify='true' data-widget-link='Categorie' data-widget-link-class='open-tip-gestione-categorie'"}
		$($(this).attr("href")).closest(".fin-widget").remove();
		$(this).closest(".widget-control-container").html("<a class='widgetAdd btn-medium btn-blue' href='#' data-widget-id='"+$(this).attr("href").substring("1")+"' data-widget-name='"+$(this).closest(".widget-controller").data("name")+"' "+additionalLinks+">Attiva widget</a>");
		}
	}).on("click", ".widgetBack", function(event){	
		//$("#analisi-spese").closest(".fin-widget").next().andSelf().slideToggle('slow');	
		$("#analisi-spese").trigger("widget.load");
		$(".toggleableWidget1").hide("slide", { direction: "right" }, 500, function(){
			$(".toggleableWidget2").show("slide", { direction: "left" }, 500);
		});
	}).on("click", ".widgetAdd", function(event){
		event.preventDefault();
		widgetCreate($(this).data("widget-id"),"full",$(this).data("widget-name"),null,null,$(this).data("widget-modify"),$(this).data("widget-link"),$(this).data("widget-link-class"));
		$(this).closest(".widget-control-container").html("<span class='green'>Widget caricato</span><a class='mlm widgetRemove btn-medium btn-black' href='#"+$(this).data("widget-id")+"'>Rimuovi</a>");
		/*$(".widget-save-position").show();*/
	}).on("click", ".widget-save-position", function(event){
		event.preventDefault();
		var messageToUser = "<div class='pal green'><h3>La lista dei widget con il loro ordinamento è stata salvata con successo</h3></div>"
		$.ajax({
		url: "/myfineco/preferenze/bf-widget/"+widgetDisp(),
		dataType:"html",
		data: "GET"
		}).
		done(function(data){
			/*$("#cboxContent .messages-container").html("<div class='no-result mvs'>La lista dei widget con il loro ordinamento è stata salvata</div>");
			$.colorbox.resize();*/
			messageToUser = "<div class='pal green'><h3>La lista dei widget con il loro ordinamento è stata salvata con successo</h3></div>"
			//setTimeout(function(){$(".widget-save-position").hide().qtip("api").hide();},2000);
		})
		.fail(function(){
			/*$("#cboxContent .messages-container").html("<div class='boxError mvs'>La lista dei widget con il loro ordinamento è stata salvata</div>");	
			$.colorbox.resize();*/
			messageToUser = "<div class='pal'><h3><strong class='red'>Attenzione:</strong><br>La lista dei widget con il loro ordinamento non è stata salvata</h3></div>"
		});
		$("#tip-conferma-salvataggio .h2").html(messageToUser);
		$(this).qtip({
			content: {
				title: {
					text: ' ', 
					button: true
				},
				text: $("#tip-conferma-salvataggio") 
			},
			style: {
				classes: 'modal-confirm-tip q-colorbox'
			},
			position: {
				my: 'center',
				at: 'center',
				target: $(window),
				viewport: $(window)
			},
			show: {
				modal: true,
				ready: true,
				event: false
			},
			hide: {
				event: 'click',
				target: $('#tip-conferma-salvataggio .salvataggioChiudi')
			}
		});
	}).on("click",".closeCbox", function(event){
		event.preventDefault();
		$("#cboxClose").click();
	}).on("click",".resetWidget", function(event){
		event.preventDefault();
		$("#spesa-contante-action").show("fast");
		$(".esito-spesa").hide("fast");
		$("#spesa-contante-action input[type='text']").val("");
		$("#category").children("option").eq(0).prop("selected",true).end().end().change().selectmenu("refresh");
	}).on("click",".reloadWidget", function(event){
		event.preventDefault();
		$.bf.preloadRq = $.ajax({
			url: '/conto-e-carte/bilancio-familiare/json/preload-data',
			type: 'POST'
			//dataType: 'json'
    	});
		$.bf.analisiSpeseRq = $.ajax({
			url: '/conto-e-carte/bilancio-familiare/json/analisi-spese'
			//type: 'POST'
		});
		$("#"+$(this).closest(".fin-widget-content").attr("id")).children().not(".hiddenByDefault").show();
		$("#"+$(this).closest(".fin-widget-content").attr("id")).find(".widgetError").hide();
		$("#"+$(this).closest(".fin-widget-content").attr("id")).trigger("widget.load");	
	})
	.on("click",".cancella-spesa-singola.qtipped",function(event){event.preventDefault();})
	.on("click",".cancella-spesa-singola:not('.qtipped')",function(event){
		event.preventDefault();
		$("#tip-cancellazione-spesa #provenienza").val($(this).data("provenienza"));
		$("#tip-cancellazione-spesa #indice-prelievo").val($(this).data("indice-prelievo"));
		$("#tip-cancellazione-spesa #indice-movimento").val($(this).data("indice-movimento"));
		$(this).qtip({
			show: {event: 'click', ready: 'true' /*, modal: true*/, solo: false},
			hide: {event: 'unfocus'},
			//hide: {event: 'click unfocus', target: $('#qtip-overlay, .ui-tooltip-close')},
			content: {
				text: $("#tip-cancellazione-spesa").html()
			},
			style: {
				classes: "tip-cancellazione-spesa bilancio-familiare-tip",
				tip: {
					width: 18,
					height: 8,
					mimic: "center"
					}
			},
			position: {
				my: "right center",
				at: "left center"
			}
		}).addClass('qtipped'); 
	}).on("click",".fin-widget-icon.modify:not('.open')",function(event){
		if($(this).closest(".fin-widget").find("#analisi-spese").length != 0){
			$(this).closest(".fin-widget").find("#analisi-spese #filtri-analisi").slideDown("fast");
			$(this).addClass("open");
		}
	}).on("click",".fin-widget-icon.modify.open",function(event){
		if($(this).closest(".fin-widget").find("#analisi-spese").length != 0){
			$(this).closest(".fin-widget").find("#analisi-spese #filtri-analisi").slideUp("fast");
			$(this).removeClass("open");

		}
	}).on('click', '.balance-list li', function (evt) {
	   var meseSelezionato = this.id.split('-')
	   $('#meseInizio').val(meseSelezionato[1]);
	   $('#meseFine').val(meseSelezionato[1]);
	   $('#widgetOrderMese').val(widgetDisp());
	   $('#formTimeframeMese').submit();                                                   
   }).on("click", ".togglecheck", function(event){
		event.preventDefault();
		var isOn = $(this).toggleClass('state-on state-off').is('.state-on'); 
		isOn ? $("#filtri-analisi input[name='categorie']").each(function(){$(this).prop("checked",false)}).change() : $("#filtri-analisi input[name='categorie']").each(function(){$(this).prop("checked",true)}).change();
		isOn ? $(this).text("Seleziona tutti") : $(this).text("Deseleziona tutti")
		if($(this).is('.state-on')){$(".alertmsgFiltri").html("<strong>Attenzione</strong>: seleziona almeno una categoria")}
		else{$(".alertmsgFiltri").html("")}
  }).on('click', '.impostaBudget', function(event){
		if($("body").find("#budget").length == 0){
			widgetCreate("budget","full","Imposta budget",null,null,null,"Imposta budget","imposta-budget");
			//$("html, body").animate({ scrollTop: ($('#budget').offset().top) - 60 }, 500);
		}
		else {$("html, body").animate({ scrollTop: ($('#budget').offset().top) - 60 }, 500);}
		
  }).on("focusout", "#spese-contante #importo", function(event){
	  		$("#spese-contante .error").remove();
		  if(Globalize.parseFloat($(this).val()) > Globalize.parseFloat($(".totaleResiduoPrelievi").text())){
			  $(this).closest("#spesa-contante-action").find(".box-spese-select-cont:last").after("<div class='clear'></div><div class='error red clearfix mts' style=''>L'importo selezionato non può superare l'importo totale dei prelievi da categorizzare</div>");
			  $("#spesa-confirm").prop("disabled",true);
			}
			else { $("#spese-contante .error").remove(); $("#spesa-confirm").prop("disabled",false);}
  });

	/* GESTIONE CATEGORIE/SOTTOCATEGORIE */	
	$('body').on('click', '.tip-gestione-categorie', function() {
		$(this).qtip({
			content: {
				title: {
					text: function( evt, api ) {
						var speseClass = !api.elements.tooltip.is('.isEntrate') ?
							' selected' :
							'';
						return '\
						<div class="clearfix">\
							<div class="float-left">\
								<h5 class="mts mls">Personalizza MoneyMap</h5>\
							</div>\
							<div class="float-right">\
								<a class="tip-btn-switchSpese' + speseClass + '" href="#">Spese</a>\
								<a class="tip-btn-switchEntrate" href="#">Entrate</a>\
							</div>\
						</div>';
					},
					button: 'Chiudi'
				},
				text: '<div class="text-align-center loading"></div>',
				ajax: {
					url: '/conto-e-carte/bilancio-familiare/gestione-categorie',// URL to the local file
					type: 'POST', // POST or GET
					cache: false,
					once: false
				}
			},
			position: {my: 'center', at: 'center', target: $(window),viewport: $(window)},
			show: {
				modal: {on: true,blur: true,escape: true},
				solo: true,
				event: 'click'
			},
			hide: {
				event: 'click',
				target: $('#qtip-overlay, .qtip-close')
			},					
			style: {
				classes: 'q-colorbox qtip-gestione-categorie'
			},
			events: {
				hide: function( evt, api) {
					api.destroy();
				},
				render: function( evt, api ) {
					var pointedIcon;
					
					api.elements.content
					.on("submit validate.submit", "form", { tooltip: api }, $.xhrDispatcher	)
					.on("click", ".select-pers-icon",function(event){
						event.preventDefault();
						api.elements.title.find(".tip-btn-switchSpese, .tip-btn-switchEntrate").hide();
						if($(this).closest("tr").find(".update-label").length > 0){
							$(this).closest("tr").find(".update-label").trigger("click");	
						}
						$("#container-elenco-categorie").hide();
						$("#container-elenco-icone").show();
						pointedIcon = $(this)
					}).on("click", "#container-elenco-icone a",function(event){
						event.preventDefault();
						$(".iconCategoria").val($(this).data("class"));
						var baseColor = "blu"
						if(api.elements.tooltip.is(".isEntrate")){
							baseColor = "verde"
						}
						pointedIcon.removeClass().addClass('select-pers-icon').addClass($(this).data("class")).addClass(baseColor);
						$("#container-elenco-categorie").show();
						$("#container-elenco-icone").hide();
						api.elements.title.find(".tip-btn-switchSpese, .tip-btn-switchEntrate").show();
					});
						
					api.elements.title.on("click", ".tip-btn-switchEntrate, .tip-btn-switchSpese", function(event){
						event.preventDefault();
						api.elements.content.find(".tooltip-error").remove();
						$(".tip-btn-switchEntrate, .tip-btn-switchSpese").removeClass("selected");
						$(this).addClass("selected");
						if($(this).is(".tip-btn-switchEntrate")){
							api.elements.tooltip.addClass("isEntrate").removeClass("isSpese");
							$(".tipo-categoria-R").show();
							$(".tipo-categoria-S").hide();
							$(".labelTipoSpesa").text("entrata");
							$(".labelTipoSpesa2").text("entrate");
						}
						else if($(this).is(".tip-btn-switchSpese")){
							api.elements.tooltip.removeClass("isEntrate").removeClass("isSpese");
							$(".tipo-categoria-R").hide();
							$(".tipo-categoria-S").show();
							$(".labelTipoSpesa").text("spesa");
							$(".labelTipoSpesa2").text("spese");
						}
					});
				}
			}
		}).qtip('show');
	}).bind( "navigate.tooltip.fineco", $.xhrLoader).bind( 'message.tooltip.fineco', $.xhrMessage );	
	$("body").on('submit','#frm-del-category',function(){
		if($(".tip-btn-switchEntrate").is(".selected")){
			$(".tip-btn-switchEntrate").trigger("click");
		}else{
			$(".tip-btn-switchSpese").trigger("click");
		}
	});						
	$('body').on('click','.goto-subcat',function(evt){							
	$('.qtip-gestione-categorie').qtip('api').elements.title.html('<div class="clear-has-content"><a class="fin-widget-icon back mrs goto-category" href="#">Indietro</a><h5 class="float-left mts">Personalizza MoneyMap</h5></div>');		
		$('#frm-goto-subcategory .idCategoria').val($(this).attr('id-cat'))
		$('#frm-goto-subcategory').submit();
	}).on('click','.goto-category',function(evt){	
		if($('.qtip-gestione-categorie').qtip('api').elements.tooltip.is(".isEntrate")){var selectedEntrate = "selected"; var selectedSpese = ""}
		else{var selectedEntrate = ""; var selectedSpese = "selected"}
		$('.qtip-gestione-categorie').qtip('api').elements.title.html('<div class="clear-has-content"><div class="float-left"><h5 class="mts mls">Personalizza MoneyMap</h5></div><div class="float-right"><a class="tip-btn-switchSpese '+selectedSpese+'" href="#">Spese</a><a class="tip-btn-switchEntrate '+selectedEntrate+'" href="#">Entrate</a></div><div class="clear"></div></div>');												
		$('#frm-goto-category').submit();
	}).on('click','.btn-add-category, .btn-add-subcategory',function(evt){								
		$(this).parents("tr").find('form:visible').submit();	
	}).on('click','.btn-update',function(evt){								
		$(this).parents("tr").find('form').submit();
	}).on('click','.del-category',function(evt){						
		$('#frm-del-category .idCategoria').val($(this).attr('id-cat'))
		$('#frm-del-category').submit();
	}).on('click','.add-category, .add-subcategory',function(evt){
		$('tr.cat-pers.insert').toggleClass("insert") 
	  	$(this).parents("tr").toggleClass("insert");
	}).on('click','.close-add',function(evt){		
		$(this).parents("tr").toggleClass("insert").find("a.select-pers-icon").removeClass().addClass("ico-mov pers1 grey select-pers-icon");
	}).on('click','.update-label',function(evt){
		$('tr.cat-add.insert').toggleClass("insert")   
	  	$('tr.cat-pers').removeClass("insert");  
	  	$(this).parents("tr").toggleClass("insert")     
	}).on('click','.close-label',function(evt){   
		$(this).parents("tr").toggleClass("insert")  
	}).on('click','.del-subcategory',function(evt){
		$('#frm-del-subcategory .idSottocategoria').val($(this).attr('id-subcat'))
		$('#frm-del-subcategory').submit();
	}).on('click','.open-tip-gestione-categorie',function(evt){
		evt.preventDefault();
		$('a.tip-gestione-categorie').trigger("click")
	})
		
	/* FINE GESTIONE CATEGORIE/SOTTOCATEGORIE */	
	$('body').on('click','.btn-conferma-sposta',function(evt){
		$(this).hide();
		var pointerClick = $(this)
		pointerClick.closest("#frm-sposta-movimento .fineco-error-in-page, .fineco-alert").remove();
		evt.preventDefault();
		setTimeout(function(){pointerClick.show()},5000);
		
		
		$.ajax({			
			type: "POST",
			url: pointerClick.closest("#frm-sposta-movimento").attr("action"),
			data: pointerClick.closest("#frm-sposta-movimento").serialize()
		}).done(function(data){
			if($.stripErrors(data).htmlError == undefined){
				$.bf.globalReload = true;
				pointerClick.closest(".qtip-sposta-spese").qtip("hide");
				$.bf.globalReload = false;
			}
			else{
				pointerClick.closest("#frm-sposta-movimento").prepend($.stripErrors(data).htmlError);
				pointerClick.closest("#frm-sposta-movimento").find(".fineco-error-in-page").show();
				pointerClick.show();
			}
		});						
	})

	/* EXPAND ANALISI SPESE E SINTESI CONTO */
    $("body").on("click", ".sintesi-conto-container .column-dx .expand-grafico", function (event) {
	   var boxContainer = $(this).data("container")
	   var widthColumnSx
	   var widthColumnDx
	   if(boxContainer == "analisi-spese-container"){
		   widthColumnSx = "22%"
		   widthColumnDx = "78%"                                            
	   }else if(boxContainer == "sintesi-conto-container") {
		   widthColumnSx = "27.56147540983607%"
		   widthColumnDx = "72.43852459016393%"
	   }
                                                               
        if ($(this).hasClass("expand-close")) {
            $(this).closest("."+boxContainer).children(".column-sx").animate({
                "width": "0%"
            }, { duration :200, queue: false}).hide();
            $(this).closest("."+boxContainer).children(".column-dx").animate({
                "width": "100%"
            }, 200, function(){
				$("#sc-graph-select").change();	
			});
            $(this).addClass("expand-open").removeClass("expand-close");
        } else if ($(this).hasClass("expand-open")) {
			$(this).closest("."+boxContainer).children(".column-dx").animate({
                "width": widthColumnDx
            }, 0, function(){
				$("#sc-graph-select").change();	
			});
            $(this).closest("."+boxContainer).children(".column-sx").animate({
                "width": widthColumnSx
            }, { duration :0, queue: false}).show();
            $(this).addClass("expand-close").removeClass("expand-open");
        }
        event.preventDefault();
    });

	
	/****** slides spese contante *****/
	
	/**** SUBMIT ACTIONS ****/
	$("body").on("click", ".tip-cancellazione-spesa-conferma", function(event){
		event.preventDefault();
		$(".q-colorbox:visible .cancella-spesa-singola, .q-colorbox:visible .btn-sposta-spese").hide();
		pointerElement = $(this);
		pointerElement.prop("disabled",true);
		setTimeout(function(){pointerElement.prop("disabled",false)},5000);
		$.ajax({
			type: "POST",
			url: $("#cancella-spesa").attr("action"),
			data: $("#cancella-spesa").serialize()
		}).
		done(function(data){
			pointerElement.closest(".tip-cancellazione-spesa").find(".cancellazione-spesa-risp").show("fast");
			pointerElement.closest(".tip-cancellazione-spesa").find("#cancella-spesa").hide("fast");
			if(data.esito == "ok"){
				pointerElement.closest(".tip-cancellazione-spesa").find(".cancellazione-spesa-risp h6").text("Spesa eliminata correttamente").addClass("green");
				$(".cancella-spesa-singola:visible").qtip("reposition");
				SCreloading = true
				//do 2 secondi prima di refreshare tutto in modo da vedere il msg
				//setTimeout(function(){$("#spese-contante").trigger("widget.load")},2000);
				if($("#tip-cancellazione-spesa #provenienza").val() == "dettaglio"){
					//nel caso in cui la cancellazzione arriva da overlay dettagli spese categoria
					reloadAllWidgets(true,false,true,true,true);
					$(".tip-cancellazione-spesa").qtip("hide");
					$("#scelta-categoria").change().selectmenu("refresh");
					$("#btn-dettagli-spese").qtip("hide");
					$("#btn-dettagli-spese").qtip("show");
				}else if($("#tip-cancellazione-spesa #provenienza").val() == "sintesi"){
					//nel caso in cui la cancellazzione arriva da overlay dettagli spese categoria
					reloadAllWidgets(true,false,true,true,true);
					$(".tipo-mov-InOut").qtip("hide");
					$(".tip-cancellazione-spesa").qtip("hide");
					if($('#tabella-mov-tipo').val() == "spese"){
						 $(".tbl-spese").qtip("show");	
					}
					else if($('#tabella-mov-tipo').val() == "entrate"){
						$(".tbl-entrate").qtip("show");	
					}//createMovInOutQtip($(".tipo-mov-InOut:visible").find("h2.grey").eq(0).text(),$(".tbl-"+$(".tipo-mov-InOut").find("h2.grey").eq(0).text().toLowerCase()).data("meseanno"));	
				} else {
					setTimeout(function(){reloadAllWidgets(true,true,true,true,true)},2000);
				}
				//CROSSWIDGET, PREVIENE IL BACO CHE SI SPACCA SE HO APPENA CANCELLATO UNA NUOVA SPESA CONT INSERITA
				$("#ultimaSpesaInseritaCategoria").val("")
			}
			else{
				pointerElement.closest(".tip-cancellazione-spesa").find(".cancellazione-spesa-risp h6").text("Attenzione, si è verificato un errore,si prega di riprovare").addClass("red");	
				pointerElement.prop("disabled",false);
			}
		});
	}).on("click", ".reDoThis", function(event){
		$("#spesa-contante-action").slideDown("fast");
		$(".esito-spesa").slideUp("fast");
	}).on("click",".tip-cancellazione-spesa-annulla", function(event){
		$(".cancella-spesa-singola.qtipped").qtip('hide');
	}).on("click",".toggleBudgetColumn",function(event){
		event.preventDefault();
		var isOn = $(this).toggleClass('state-on state-off btn-blue btn-gray').is('.state-on');
		isOn? $(this).text("ON") : $(this).text("OFF")
		isOn? $(".visualizzaBudget").val(true) : $(".visualizzaBudget").val(false);
		$(".updateFiltriAnalisi").trigger("click");
	});
	/*GESTIONE SPOSTA SPESE */																						
	$('body').on('click','.btn-sposta-spese:not([aria-describedby^=qtip])',function(evt){	
		//check provenienza		
		//nascondo tutti i bottoni in modo tale che non siano riclickabili
		$(".btn-sposta-spese, .q-colorbox .cancella-spesa-singola").hide();
		/*var provenienzaVar = "dettaglio"
		if($(this).closest(".tipo-operazione").length > 0){
			provenienzaVar = "operazione"
		}
		else if($(this).closest(".tipo-mov-InOut").length > 0){
			provenienzaVar = "sintesi"
		}
		else if($(this).data("provenienza") == "nascosti"){
			provenienzaVar = "nascosti"
		}*/
		if($(this).data("provenienza") == "dettaglio"){
			$("#btn-dettagli-spese").qtip("hide"); //Nascondo il qtip sotto
		}
		else if($(this).data("provenienza") == "sintesi"){
			$(".tipo-mov-InOut").qtip("hide");//Nascondo il qtip sotto
		}
		else if($(this).data("provenienza") == "nascosti" || $(this).data("provenienza") == "operazione"){
			$(this).closest(".q-colorbox").qtip("hide");
		}
		var provenienzaVar = $(this).data("provenienza");
		$(this).qtip({		
			content: {
			title: {text: ' ', button: 'Chiudi'},
			text: '<div class="text-align-center loading"></div>',
				ajax: {
					url: '/conto-e-carte/bilancio-familiare/categoria-movimento',// URL to the local file
					type: 'POST', // POST or GET
					data: {
						indiceMovimento: $(this).data('indice-movimento'),
						provenienza: provenienzaVar
					},
					success: function(data) {
						this.set('content.text', data);
						
						$.initElements.apply(this.elements.content);
						this.elements.target
							.bind('navigate.tooltip.fineco', $.xhrLoader)
							.bind('message.tooltip.fineco', $.xhrMessage)
							.bind('navigation-done.tooltip.fineco', function(evt, api, data) {
								if (data.responseText.replace(/\s+/gm, '' ) == '' ) {
									//window.location.reload(true)
									//reloadAllWidgets(true,true,true,true)
									api.hide();
									}
								});												
							this.elements.content.on("submit validate.submit", "form", { tooltip: this }, $.xhrDispatcher);									
					}																			
				}			
			},																												
			show: {event: 'click', ready: true, modal: true},
			hide: {
				event: 'click',
				target: $('#qtip-overlay, .qtip-close')
			},															
			position: {my: 'center', at: 'center', /*viewport: $(window),*/ target: $(window)},
			effect: false,																
			style: {
				classes : "q-colorbox qtip-sposta-spese",
				width: 360																
			},
			events: {
				hide: function(event, api) {
					if( !api.elements.target.closest('body').length )
						return;
					
					if($(this).find("#indiceProvenienza").val() == "operazione"){
						api.destroy();
						$(".ico-ope."+$("#colonnaDiProvenienza").val()).qtip().show();
						setTimeout(function(){$("#qtip-overlay").css({"opacity":"100"}).show()},400);
						//mostro l'overlay perché anche qua, bug di qtip2+
					}else if($(this).find("#indiceProvenienza").val() == "dettaglio"){
						 $.when( $.bf.analisiSpeseRq ).done(function( analisiSpeseRqData ){
							 var optSelectedId = $("#scelta-categoria").children("option:selected").val();
							 var optSelected
							 $.each(analisiSpeseRqData.codiceCategoria, function (index, value) {
								 if (optSelectedId == value) {
									 optSelected = index
									 return false
								 }
							 });
							reloadAllWidgets(true,true,true,false,true);
							var totaleSpeseCategoria = resultDetCat.spesaCategoria[optSelected];
							if(resultDetCat.budgetCategoria != null){
								var totaleBudgetCategoria = resultDetCat.budgetCategoria[optSelected];
							}else{var totaleBudgetCategoria = 0}
							if(resultDetCat.rimanenzaCategoria != null){
								var saldoBudgetCategoria = resultDetCat.rimanenzaCategoria[optSelected];
							}else{var saldoBudgetCategoria = 0}
							optSelected == null ? totaleSpeseCategoria = "-" : totaleSpeseCategoria = Globalize.format(totaleSpeseCategoria, "c2");
							optSelected == null ? totaleBudgetCategoria = "-" : totaleBudgetCategoria = Globalize.format(totaleBudgetCategoria, "c2");
							optSelected == null ? saldoBudgetCategoria = "-" : saldoBudgetCategoria = Globalize.format(saldoBudgetCategoria, "c2");
							$('#totale-spese-categoria').text(totaleSpeseCategoria);
							$('#totale-budget-categoria').text(totaleBudgetCategoria);
							$('#saldo-budget-categoria').text(saldoBudgetCategoria);				
						});
						// distruggo il Qtip corrente perché sennò propaga gli eventi , bug di qtip 2+
						api.destroy();
						$(".tab-composizione").trigger("click");
						$("#btn-dettagli-spese").qtip("show");
						setTimeout(function(){$("#qtip-overlay").css({"opacity":"100"}).show()},400);
						//mostro l'overlay perché anche qua, bug di qtip2+
					}else if($(this).find("#indiceProvenienza").val() == "sintesi"){
						api.destroy();
						if($('#tabella-mov-tipo').val() == "spese"){
							 $(".tbl-spese").qtip("show");	
						}
						else if($('#tabella-mov-tipo').val() == "entrate"){
							$(".tbl-entrate").qtip("show");	
						}
						setTimeout(function(){$("#qtip-overlay").css({"opacity":"100"}).show()},400);
						//mostro l'overlay perché anche qua, bug di qtip2+
						setTimeout(function(){reloadAllWidgets(true,true,true,true,true);}, 500)
					}else if($(this).find("#indiceProvenienza").val() == "nascosti"){
						reloadAllWidgets(true,true,true,true,true);
						api.destroy();
						$(".movimenti-nascosti-qcolorbox").trigger("click");
						setTimeout(function(){$("#qtip-overlay").css({"opacity":"100"}).show()},400);
						//mostro l'overlay perché anche qua, bug di qtip2+
					}
				}
			}				
		})
		$("#escludiMovimento").change();
	});
	
	$('body').on('change','#riclassificazioneAutomatica',function(evt){
		var value = $(this).prop('checked');								
		if(value==true)
			$('.ssBox').show();
		else
			$('.ssBox').hide();
	});
									
	$('body').on('change','.selector',function(evt){
		var mov = $(this).data('mv');
		var catSel = $(this).find(':selected').val();
		var optionCatSel = $('#'+mov+'_'+catSel+' option').clone();								
		$('#'+mov+'_sottocategoria').empty();
		$('#'+mov+'_sottocategoria').append(optionCatSel);
	
		$('#'+mov+'_sottocategoria').selectmenu('refresh',true);
	}).on('change', '#escludiMovimento', function(event){
		if($(this).prop("checked")){
			//$(this).closest(".qtip-sposta-spese").find("select[name='idCategoria']").prop("disabled",true).selectmenu('refresh');
			//$(this).closest(".qtip-sposta-spese").find("select[name='idSottocategoria']").prop("disabled",true).selectmenu('refresh');
			//$(".toggleIfHidden").show()
			//$("#mvCategory").hide();
			$('#opacize').toggleClass('opacize', true);
			$(".toggleIfHidden").toggle(true);					
		}
		else{
			//$(this).closest(".qtip-sposta-spese").find("select[name='idCategoria']").prop("disabled",false).selectmenu('refresh');
			//$(this).closest(".qtip-sposta-spese").find("select[name='idSottocategoria']").prop("disabled",false).selectmenu('refresh');				
			//$(".toggleIfHidden").hide()
			//$("#mvCategory").show();
			$('#opacize').toggleClass('opacize', false);
			$(".toggleIfHidden").toggle(false);			
		}
	});																	
	/* FINE GESTIONE SPOSTA SPESE */
});
