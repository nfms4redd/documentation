=====================
Interface description
=====================

The NFMS portal page is composed of the following main user interface elements:

:ref:`Map <map>`
   Allows to overlay, browse and query all the layers available in the portal
:ref:`Navigation Buttons <navigation-buttons>`
   Used to browse the map (zoom in and out, and zoom to maximum extent)
:ref:`Layers Pane <layers-pane>`
   Used to show or hide layers on the map, and to access layers legend and general information
:ref:`Time Slider <time-slider>`
   In case of time dependent layers, it allows to select a time instance
:ref:`Language Selection Buttons <language-buttons>`
   When multiple language are supported they allow to select different languages
:ref:`Legend Pane <legend-pane>`
   Shows the legend for the visible layers, together with the link to their source

.. figure:: img/whole_page.png
   :align: center
   :scale: 75 %

   NFMS portal

Follows a detailed description of the user interface elements and functions described above.

.. _map:

Map
===

The map is the main component of the web portal, it allows the user to overlay and query all the informative layers available in the web portal. The map extent and zoom level can be dynamically adjusted allowing the user to focus on a particular area of interest. It also allows to access statistics for specific polygons and layers.


.. _navigation-buttons:

Navigation Buttons
==================

Navigation buttons are used to zoom in and out and to the maximum extent (the whole country). Zoom levels are discontinuous, and match Google Maps™ ones to allow overlay with their layers if needed. When the map is zoomed on a small area and you want to quickly move to another one, you can zoom to the maximum extent and then zoom in again to the area you are interested in.

.. figure:: img/nav_buttons.png
   :align: center
   :scale: 75 %

   Navigation buttons


.. _layers-pane:

Layers Pane
===========

The layers pane shows all the map layers available in the portal, organized in a three-level structure. The first level it's thematic areas which the layers belongs to. On the example below they are:

* Base layers
* Administrative areas
* REDD+ activity
* Forest area and forest area change
* Safeguards
* Other


.. figure:: img/layers_pane.png
   :align: center
   :scale: 75 %

   Layers pane


Clicking on one of these headers expands the corresponding pane and shows the layers in that thematic area (Forest Area and Forest Area Change in the figure above).

Layers can eventually be grouped in a second-level sub-category. On the given example, in the `Forest area and forest area change` thematic area, layers are grouped in the following sub-categories:

* Forest land remaining forest land
* Forest land converted to non-forest land
* Non-forest land converted to forest-land
* Biomass fire

Finally at the third level (or second if not in a subcategory) are the map layers.


For each layer the following features are buttons/icons available:

* :ref:`Layer show checkbox <layer-show>` 
* :ref:`Inline legend icon <inline-legend>`
* :ref:`Inline legend button <inline-legend-button>`
* :ref:`Layer info button <layer-info-button>`


.. _layer-show:

Showing Layers
--------------

If the layer is actually available as an online map (it could not be available as GIS data but the administrator might want the label to be there), a checkbox is shown at its left to add it to the map. Clicking on the checkbox adds the layer to the map and its legend to the `Legend Pane <legend-pane>` if available. If present, the inline legend button is activated.


.. _inline-legend:

Inline Legends
--------------

When the layer has one single category (in the case of country boundary layers for instance), an inline legend icon is shown at the left of its label in the :ref:`layers pane <layers-pane>`.

.. figure:: img/layer_inline_legend.png
   :align: center
   :scale: 75 %

   Inline legend


.. _inline-legend-button:

Inline Legend Buttons
---------------------

If the layer has a more complex legend, a "show legend" button is shown instead. When the layer is not active the icon is grayed-out and not active as a button. When the layer is added to the map, the inline legend button is activated and by clicking on it the `Legend Pane <legend-pane>` is shown and its content automatically scrolls to the legend requested.

.. figure:: img/inline_legend_button.png
   :align: center
   :scale: 75 %

   Inline legend button


.. _layer-info-button:

Layer info button
-----------------

If layer information is available, an info button is shown at the right of the layer label. When you click on it, a modal dialog appears with a description of the layer, which may contain the following information:

* Layer description
* Original data source
* Logos of the organizations providing the data
* Any other relevant information

.. figure:: img/layer_info.png
   :align: center
   :scale: 75 %

   Layer info dialog


.. _time-slider:

Selected Layers Pane
====================

.. figure:: img/selected_layers.png
   :align: center
   :scale: 75 %

   Selected layers pane

Clicking on the ``Selected layers`` button you get a subset of the layer list containing only the ones that are currently visible. It's possible to change the transparency for each layer using the slider under its label.


Time Slider
===========

Some of the layers, in particular the ones that are periodically produced, are time-dependent. This means that there are different versions of the layer for different points in time. To choose a date among the ones available you can drag the time slider (see figure below). The date that the system chooses for each layer is its closest previous one available for that layer. To better explain this behavior let's consider a particular case in which we have the following layers and dates:

* Deforestation - years 2000, 2005, and 2010
* Landsat mosaic - years 2000 and 2010.

If you select 2005 in the time slider,  the system will automatically choose Deforestation year 2005 (as it matches the value you selected) and Landsat mosaic year 2000 (the previous year closest to the one you have chosen).

.. figure:: img/time_slider.png
   :align: center
   :scale: 75 %

   Time slider



.. _language-buttons:

Language Selection Buttons
==========================

Portal language is selected by clicking on the language buttons. Depending on the country where the portal is implemented, different languages are available. 

When you select a language the system remembers it the next times you reload the portal.

.. figure:: img/language_buttons.png
   :align: center
   :scale: 75 %

   Language buttons


.. _legend-pane:

Legend Pane
===========

The legend is hidden by default. To show it you can either

* click on the legend button on the top of the page
* click on the :ref:`inline legend button <inline-legend-button>`, on the left of the layers that have a legend

The pane  shows the legends for the layers that are being shown on the map. When clicking on an inline legend icon related to a layer, the pane automatically scrolls to its legend.

.. figure:: img/legend_pane.png
   :align: center
   :scale: 75 %

   Legend pane


Page Footer
===========

The footer section of the portal contains popups/links to pages with relevant information related to the project in general and could contain links to information specific for the country.

.. figure:: img/footer_links.png
   :align: center
   :scale: 75 %

   Footer links

The scale of the map is shown at the bottom right of the page.

Browsing the Map
================


Panning and zooming
-------------------

Map panning is done by dragging of the mouse pointer over the map itself

Zooming can be done in the following three ways:

* clicking on the zoom in and zoom out buttons on the top-left of the page
* shift-dragging the mouse pointer over the map
* double-clicking on any point on the map

You can also zoom to the maximum extent using the ``zoom to max extent`` button, positioned next to the zoom-in button and usually showing a stylized shape of the country.



Querying the map
================

The Query Dialog
----------------

.. figure:: img/query_dialog.png
   :align: center
   :scale: 75 %

   Query Dialog

If any `queryable` layer is visible on the map, you can get access to information and statistics related to them by clicking on the point you are interested to. A dialog is shown with an entry for each queryable layer that has features (if vector) or a value different from "no-data" (if raster) on that point. When hovering one of the entries in the dialog, the related polygon feature is highlighted on the map (see image below). You can also zoom to that area by clicking the ``Zoom to area`` button, and access statistics based on it.

.. figure:: img/query_dialog_2.png
   :align: center
   :scale: 75 %

   Query Dialog - feature highlight



Pre-calculated Statistics
-------------------------

By clicking on ``the statistics`` button in the query dialog, a modal popup containing the statistics for the area is shown.

.. figure:: img/chart.png
   :align: center
   :scale: 75 %

   Chart dialog

Hovering the mouse on the chart shows actual values.

The chart can be printed clicking on the printer button on the top left of the dialog.

Feedback
========

If you want to send comments on the published resources, click on the *Feedback* button on the header.
The feedback dialog will open:

.. figure:: img/feedback_dialog.png
   :align: center

   Feedback dialog

1. Select the **layer** you want to give feedback on (for example, *REDD+ Projects*). To appear in the selector, the layer must be active.
2. Use the **drawing tools** to delimitate the area or areas your comments are refering to. The toolbar offers three different tools:

   * |tb_add| **Add Polygon** to draw new areas on the map.
   * |tb_get| **Get feature from selected layer** to retrieve a geometry from a layer. This tool is only active on queryable vector layers.
   * |tb_edit| **Edit Polygon** to change the shape of an area. Drag the nodes to change the shape, or hit *del* key to delete existing vertices or the entire polygon.

3. Write your contact **name** and **email**. System administrators may want to contact you for further details on your request.
4. Add a **feedback** message describing your concerns.
5. Write the **reCAPTCHA** words and **Submit**.

.. |tb_add| image:: img/toolbar_button_add.png
.. |tb_get| image:: img/toolbar_button_get.png
.. |tb_edit| image:: img/toolbar_button_edit.png


Feedback example
----------------

Let's say that you detect a *REDD+ project region* that is out of date:

.. figure:: img/feedback_polygon_view.png
   :align: center

   Identify an element worth comenting on the map

First, click on *Feedback* and select the *REDD+ Projects* layer. Activate the |tb_get| tool and click inside the region.
The original polygon will be retrieved and presented as an orange, editable geometry:

.. figure:: img/feedback_polygon_get.png
   :align: center

   Get an existing element from the layer

Then, select the |tb_edit| tool to change its shape draging the nodes:

.. figure:: img/feedback_polygon_edit.png
   :align: center

   Change its shape
   
Finally, add a *feedback* text comment. For example: *REDD+ Project has been extended to the eastern valley*.
