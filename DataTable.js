/**
 * Creates a new instance of <b>DataTable</b>.
 * @param {type} o An object that contains basic table configurations. 
 * This object can have the following set of attributes:
 * <ul>
 * <li><b>parent-html-id</b>: The ID of the container that the table will be appended 
 * to.</li>
 * <li><b>header</b>: A boolean value. If set to true, the table will have headers 
 * for the columns.</li>
 * <li><b>header</b>: A boolean value. If set to true, the table will have footers 
 * for the columns.</li>
 * <li><b>show-row-num</b>: A boolean value. If set to true, the table will show 
 * row numbers.</li>
 * <li><b>paginate</b>: A boolean value. If set to true, the table will include 
 * pagination controls such as enries count per page and page select buttons.</li>
 * <li><b>enable-search</b>: A boolean value. If set to true, A text box for search 
 * will be included with the table that can be used to search in the columns that has the 
 * attribute <b>'search-enabled'</b> set to true.</li>
 * <li><b>selective-search</b>: A boolean value. If search is enabled and this attribute is set to true, 
 * a combobox will be included with the table to select a column to search on.</li>
 * <li><b>lang</b>: An attribute that contains an object for table labels. The object has the 
 * following attributes for the labels:
 * <ul><li><b>show-label</b>: : Used for pagination control which is used to select how 
 * many rows to show in each page.</li>
 * <ul><li><b>no-data-label</b>: A label that will show if no data can be shown.</li>
 * <ul><li><b>search-label</b>: A label that will be shown along side search textbox.</li>
 * <ul><li><b>select-col-label</b>: A label that will be shown along side the combobox 
 * that is used to select search column.</li>
 * <ul><li><b>print-label</b>: A label to show in the print button.</li>
 * </ul>
 * </li>
 * </ul>
 * @param {Array} cols An array that contains objects. Each object represents one 
 * column. Each object can have the following attributes:
 * <ul>
 * <li><b>key</b>: A unique name for the column. The key is used in case of adding new 
 * row to the table.</li>
 * <li><b>title</b>: A text to show in the header and the footer of the column.</li>
 * <li><b>width</b>: The width of the column in percentage.</li>
 * <li><b>sortable</b>: A boolean value. If set to true, the rows of the column will 
 * be sortable. Default is false.</li>
 * <li><b>search-enabled</b>: A boolean value. if set to true, the user will be able to search 
 * the data on the column. Default is false.</li>
 * <li><b>printable</b>: A boolean value. If set to true, The column will appear in case 
 * of printing. Default is true.</li>
 * </ul>
 * @param {Array} data An initial array of objects. 
 * @constructor
 * @returns {DataTable} An instance of the class.
 */
function DataTable(o={},cols=[],data=[]){
    var inst = this;
    Object.defineProperty(this,'obj',{
        value:{},
        enumerable:false,
        configurable:false,
        writable:false
    });
    Object.defineProperties(this.obj,{
        paginate:{
            value:o.paginate
        },
        'parent-html-id':{
            value:o['parent-html-id']
        },
        printable:{
            value:o.printable
        },
        'show-row-num':{
            value:o['show-row-num']
        },
        'enable-search':{
            value:o['enable-search']
        },
        'selective-search':{
            value:o['selective-search']
        },
        header:{
            value:o.header
        },
        footer:{
            value:o.footer
        },
        attach:{
            value:o.attach
        },
        'events':{
            value:{}
        }
    });
    Object.defineProperties(this.obj.events,{
        onrowadded:{
            value:null,
            writable:true,
            configurable:true
        },
        onrowremoved:{
            value:null,
            writable:true,
            configurable:true
        },
        oncoladded:{
            value:null,
            writable:true,
            configurable:true
        }
    });
    this.setLogEnabled(o['enable-log']);
    this.log('DataTable: Initializing table.','info');
    this.log('DataTable: Creating containers and basic elements.','info');
    Object.defineProperties(this,{
        container:{
            value:document.createElement('div'),
            enumerable:false,
            writable:false,
            configurable:false
        },
        
        table:{
            value:document.createElement('table'),
            enumerable:false,
            writable:false,
            configurable:false
        },
        col_set:{
            value:document.createElement('colgroup'),
            enumerable:false,
            writable:false,
            configurable:false
        },
        t_controls:{
            value:document.createElement('div'),
            enumerable:false,
            writable:false,
            configurable:false
        },
        t_body:{
            value:document.createElement('tbody'),
            enumerable:false,
            writable:false,
            configurable:false
        },
        noDataRow:{
            value:document.createElement('tr'),
            enumerable:false,
            writable:false,
            configurable:false
        }
    });
    this.table.className = 'datatable';
    this.t_controls.className = 'datatable-controls';
    
    this.log('DataTable: Done.','info');
    this.log('DataTable: Checking if search is enabled.','info');
    if(this.isSearchEnabled()){
        this.log('DataTable: It is enabled. Creating search controls','info');
        Object.defineProperties(this,{
            search_input:{
                value:document.createElement('input'),
                enumerable:false,
                writable:false,
                configurable:false
            },
            search_label:{
                value:document.createElement('label'),
                enumerable:false,
                writable:false,
                configurable:false
            }
        });
        this.log('DataTable: Initializing search event.','info');
        this.search_input.oninput = function(){
            this.log('DataTable: Search value changed.','info');
            inst.search(this.value);
        };
        
        this.log('DataTable: Finished creating search controls','info');
        this.log('DataTable: Checking if selective search is enabled.','info');
        if(this.isSelectiveSearchEnabled()){
            this.log('DataTable: It is enabled. Creating selective search controls','info');
            Object.defineProperties(this,{
                col_select:{
                    value:document.createElement('select'),
                    enumerable:false,
                    writable:false,
                    configurable:false
                }
            });
            var o = document.createElement('option');
            o.value = 'all';
            o.innerHTML = 'Select Column Name to Search by...';
            o.selected = true;
            this.col_select.appendChild(o);
            this.col_select.onchange = function(){
                if(this.value === 'all'){
                    inst.obj['search-col'] = undefined;
                    inst.log('DataTable: Search col = [All Columns]');
                }
                else{
                    inst.obj['search-col'] = inst.getColumn(this.value);
                    inst.log('DataTable: Search col = ['+inst.obj['search-col']+']');
                }
            };
            this.log('DataTable: Finished creating selective search controls','info');
        }
        else{
            this.log('DataTable: Selective search is disabled.','info');
        }
    }
    else{
        this.log('DataTable: Search is disabled.','info');
    }
    this.log('DataTable: Checking if print is enabled.','info');
    if(this.isPrintable()){
        this.log('DataTable: Printing is enabled.','info');
        this.log('DataTable: Initializing print control.','info');
        Object.defineProperties(this,{
            print_button:{
                value:document.createElement('button'),
                enumerable:false,
                writable:false,
                configurable:false
            }
        });
        this.log('DataTable: Initializing print button onclick event.','info');
        this.print_button.onclick = function(){
            inst.log('DataTable: Print click.','info');
            inst.print(document.dir);
        };
        this.log('DataTable: Initializing table print event.','info');
        this.table.print = function(dir='ltr'){
            var t = document.createElement('table');
            t.innerHTML = this.innerHTML;
            var bodyIndex = inst.hasHeader() ? 2 : 1;
            var footerIndex = inst.hasHeader() ? 3 : 2;
            //remove all body cells
            while(t.children[bodyIndex].children.length !== 0){
                t.children[bodyIndex].removeChild(t.children[bodyIndex].children[0]);
            }
            //check for hidden columns and remove them.
            var hiddenCols = 0;
            for(var x = 0 ; x < inst.cols(); x++){
                var col = inst.getColumn(x);
                //remove non printable columns
                if(col.printable === false){
                    var colGroup = t.children[0].children[col.index - hiddenCols];
                    t.children[0].removeChild(colGroup);

                    if(inst.hasHeader()){
                        var hCell = t.children[1].children[0].children[col.index - hiddenCols];
                        t.children[1].children[0].removeChild(hCell);
                    }
                    if(inst.hasFooter()){
                        var fCell = t.children[footerIndex].children[0].children[col.index - hiddenCols];
                        t.children[footerIndex].children[0].removeChild(fCell);
                    }
                    hiddenCols++;
                }
            }

            //iserting data to the new table
            if(inst.rows() === 0){
                var noDataRow = document.createElement('tr');
                var noDataCell = document.createElement('td');
                noDataCell.colSpan = inst.cols() - hiddenCols;
                noDataCell.innerHTML = inst.noDataRow.children[0].innerHTML;
                noDataRow.appendChild(noDataCell);
                noDataCell.style['text-align'] = 'center';
                t.appendChild(noDataRow);
            }
            else{
                for(var x = 0 ; x < inst.rows() ; x++){
                    var data = inst.getData()[x];
                    if(data.show === true || data.show === undefined){
                        var row = document.createElement('tr');
                        for(var y = 0 ; y < inst.cols() ; y++){
                            var col = inst.getColumn(y);
                            if(col.printable === true){
                                var cell = document.createElement('td');
                                cell.innerHTML = data[col.key];
                                row.appendChild(cell);
                            }
                        }
                        t.children[bodyIndex].appendChild(row);
                    }
                }
            }
            //create hidden frame fro printing
            var oHiddFrame = document.createElement("iframe");
            oHiddFrame.name = 'print-frame';
            var css = document.createElement("link");
            var doc = document;
            var wndw = window;
            oHiddFrame.domain = document.domain;
            oHiddFrame.onload = function(){
                css.href = "https://rawgit.com/usernane/js-datatable/master/DataTable.css"; 
                css.rel = "stylesheet"; 
                css.type = "text/css";
                wndw.frames['print-frame'].document.body.dir = dir;
                wndw.frames['print-frame'].document.body.appendChild(css);
                wndw.frames['print-frame'].document.body.appendChild(t);
                wndw.frames['print-frame'].document.getElementsByTagName('table')[0].className = 'datatable';
                wndw.frames['print-frame'].document.getElementsByTagName('table')[0].border = "1";
                oHiddFrame.contentWindow.__container__ = this;
                oHiddFrame.contentWindow.onafterprint = function(){
                    doc.body.removeChild(this.__container__);
                };
                oHiddFrame.contentWindow.focus();
                oHiddFrame.contentWindow.print();
            };
            oHiddFrame.style.visibility = "hidden";
            oHiddFrame.style.position = "fixed";
            oHiddFrame.style.right = "0";
            oHiddFrame.style.bottom = "0";
            document.body.appendChild(oHiddFrame);
        };
        this.log('DataTable: Finished initializing print control.','info');
    }
    else{
        this.log('DataTable: Print is disabled.','info');
    }
    this.log('DataTable: Checking if pagination is enabled.','info');
    if(this.isPaginationEnabled()){
        this.log('DataTable: It is enabled. Initializing pagination controls.','info');
        Object.defineProperties(this,{
            rowCountSelect:{
                value:document.createElement('select'),
                enumerable:false,
                writable:false,
                configurable:false
            },
            rowCountSelectLabel:{
                value:document.createElement('label'),
                enumerable:false,
                writable:false,
                configurable:false
            },
            pageNumberContainer:{
                value:document.createElement('div'),
                enumerable:false,
                writable:false,
                configurable:false
            },
            nextPageButton:{
                value:document.createElement('button'),
                enumerable:false,
                writable:false,
                configurable:false
            },
            prevPageButton:{
                value:document.createElement('button'),
                enumerable:false,
                writable:false,
                configurable:false
            },
            numbersContainer:{
                value:document.createElement('div'),
                enumerable:false,
                writable:false,
                configurable:false
            }
        });
        this.pageNumberContainer.className = 'page-controls';
        this.numbersContainer.className = 'page-number-container';
        
        this.log('DataTable: Initializing \'next\' and \'previous\' buttons events.','info');
        
        this.nextPageButton.onclick = function(){
            var rowsCount = inst.rowsToDisplay();
            if(inst.obj.end !== inst.filteredRows()){
                inst.pageNumberContainer.children[2].children[inst.obj.active].className = '';
                inst.obj.active++;
                inst.pageNumberContainer.children[2].children[inst.obj.active].className = 'active';
                inst.obj.start = inst.obj.start + inst.rowsPerPage();
                inst.obj.end = inst.obj.end + rowsCount;
                inst.displayPage();
            }
        };
        this.prevPageButton.onclick = function(){
            if(inst.obj.start !== 0){
                inst.pageNumberContainer.children[2].children[inst.obj.active].className = '';
                inst.obj.active--;
                inst.pageNumberContainer.children[2].children[inst.obj.active].className = 'active';
                inst.obj.end = inst.obj.start;
                inst.obj.start = inst.obj.start - inst.rowsPerPage();
                inst.displayPage();
            }
        };
        
        this.log('DataTable: Initializing rows count select per page.','info');
        var option1 = document.createElement('option');
        option1.innerHTML = '10';
        option1.value = '10';
        option1.setAttribute('selected',true);
        this.rowCountSelect.appendChild(option1);
        var option1 = document.createElement('option');
        option1.innerHTML = '25';
        option1.value = '25';
        this.rowCountSelect.appendChild(option1);
        var option1 = document.createElement('option');
        option1.innerHTML = '50';
        option1.value = '50';
        this.rowCountSelect.appendChild(option1);
        var option1 = document.createElement('option');
        option1.innerHTML = '100';
        option1.value = '100';
        this.rowCountSelect.appendChild(option1);
        this.nextPageButton.innerHTML = '&gt;';
        this.prevPageButton.innerHTML = '&lt;';
        this.log('DataTable: Finished initializing pagination controls.','info');
    }
    else{
        this.log('DataTable: Pagination is disabled.','info');
    }
    this.log('DataTable: Checking if table has header or not.','info');
    if(this.hasHeader()){
        this.log('DataTable: It has header.','info');
        this.log('DataTable: Initializing header.','info');
        Object.defineProperty(this,'header',{
            value:{},
            enumerable:false,
            writable:false,
            configurable:false
        });
        Object.defineProperties(this.footer,{
            t_header:{
                value:document.createElement('thead'),
                enumerable:false,
                writable:false,
                configurable:false
            },
            t_h_row:{
                value:document.createElement('tr'),
                enumerable:false,
                writable:false,
                configurable:false
            }
        });
        this.log('DataTable: Initializing header finished.','info');
    }
    else{
        this.log('DataTable: It has no header.','info');
    }
    if(this.hasFooter()){
        this.log('DataTable: It has footer.','info');
        this.log('DataTable: Initializing footer.','info');
        Object.defineProperty(this,'footer',{
            valeu:{},
            enumerable:false,
            writable:false,
            configurable:false
        });
        Object.defineProperties(this.footer,{
            t_footer:{
                value:document.createElement('tfoot'),
                enumerable:false,
                writable:false,
                configurable:false
            },
            t_f_row:{
                value:document.createElement('tr'),
                enumerable:false,
                writable:false,
                configurable:false
            }
        });
        this.log('DataTable: Initializing footer finished.','info');
    }
    else{
        this.log('DataTable: It has no footer.','info');
    }
    this.log('DataTable: Finished containers and elements.','info');
    this.log('DataTable: Initializing cols and data arrays.','info');
    Object.defineProperties(this.obj,{
        cols:{
            value:[],
            enumerable:false,
            writable:false,
            configurable:false
        },
        data:{
            value:[],
            enumerable:false,
            writable:false,
            configurable:false
        }
    });
    this.log('DataTable: Finished initializing cols and data arrays.','info');

    this.log('DataTable: Checking attribute \'show-row-num\' value.','info');
    if(this.obj['show-row-num'] === true){
        this.log('DataTable: Value = \'true\'.','info');
        var numCol = {
            title:'#',
            width:4,
            key:'row-index',
            type:'number',
            printable:false
        };
    }
    else{
        this.log('DataTable: Value = \'false\' or something else.','info');
        var numCol = {
            title:'#',
            width:4,
            key:'row-index',
            type:'number',
            hidden:true,
            printable:false
        };
    }
    
    this.log('DataTable: Adding row number column to the table.','info');
    this.addColumn(numCol);
    if(Array.isArray(cols)){
        this.log('DataTable: Adding columns...','info');
        for(var x = 0 ; x < cols.length ; x++){
            this.addColumn(cols[x]);
        }
    }
    else{
        this.log('DataTable: attribute \'cols\' is not an array.','warning',true);
    }
    this.log('DataTable: Checking initial dataset','info');
    if(Array.isArray(data)){
        this.log('DataTable: Adding data to the table...','info');
        for(var x = 0 ; x < data.length ; x++){
            this.addRow(data[x]);
        }
    }
    else{
        this.log('DataTable: attribute \'data\' is not an arrar.','warning',true);
    }
    this.container.className = 'table-container';
    this.t_controls.className = 'datatable-controls';
    
    
    this.log('DataTable: Initializing NO DATA cell.','info');
    this.noDataRow.appendChild(document.createElement('td'));
    this.noDataRow.children[0].style['text-align'] = 'center';
    this.log('DataTable: Checking language attribute.','info');
    if(typeof this.obj.lang !== 'object'){
        this.log('DataTable: Attribute \'lang\' is not set. Setting to default.','warning');
        this.obj.lang = {};
    }
    this.setShowSelectLabelText(this.obj.lang['show-label']); 
    this.setNoDataText(this.obj.lang['no-data-label']);
    this.setSearchLabel(this.obj.lang['search-label']);
    this.setPrintLabel(this.obj.lang['print-label']);
    this.setSelectColLabel(this.obj.lang['select-col-label']);
    
    if(this.obj.attach === true){
        this.attach();
    }
    this.table.appendChild(this.col_set);
    this.table.appendChild(this.t_body);
    this.container.appendChild(this.t_controls);
    this.container.appendChild(this.table);
    if(this.isPrintable()){
        this.t_controls.appendChild(this.print_button);
    }
    this.validateDataState();
    this.log('DataTable: Initializing completed.','warning');
}
Object.defineProperty(DataTable,'SUPPORTED_DATATYPES',{
    value:['boolean','string','number']
});
Object.assign(DataTable.prototype,{
    /**
     * Checks if pagination is enabled or disabled.
     * @returns {Boolean} True if enabled. False otherwise.
     */
    isPaginationEnabled:function(){
        return this.obj.paginate === true;
    },
    /**
     * Checks if print functionality is enabled or not.
     * @returns {Boolean} True if enabled. False otherwise.
     */
    isPrintable:function(){
        return this.obj.printable === true;
    },
    /**
     * Enable or disable logging mode (used for development).
     * @param {Boolean} bool If true is given, logging mode will be enabled. If 
     * any thing else is given, logging mode will be disabled. Default value is 
     * false.
     * @returns {undefined}
     */
    setLogEnabled:function(bool=false){
        if(bool === true){
            this.obj['enable-log'] = true;
            this.log('DataTable.setLogEnabled: Logging mode is enabled.','warning');
        }
        else{
            this.log('DataTable.setLogEnabled: Logging mode is disabled.','warning',true);
        }
    },
    /**
     * Sets a callback that will be called after row removal.
     * @param {Function} func The callback.
     * @returns {undefined}
     */
    setOnRowRemoved:function(func){
        if(typeof func === 'function'){
            this.obj.events.onrowremoved = func;
            this.log('DataTable.setOnRowRemoved: Callback is added.','info');
        }
        else{
            this.log('DataTable.setOnRowRemoved: Given parameter is not a function.','warning',true);
        }
    },
    /**
     * Print the table.
     * @param {String} dir Printing direction. can be 'ltr' or 'rtl'.
     * @returns {undefined}
     */
    print:function(dir='ltr'){
        if(typeof dir === 'string'){
            dir = dir.toLowerCase();
            if(dir === 'ltr' || dir === 'rtl'){
                this.table.print(dir);
            }
            else{
                this.log('DataTable.print: Invalid print writing direction: '+dir+'. \'rtl\' is used','warning',true);
                this.table.print('ltr');
            }
        }
        else{
            this.log('DataTable.print: Invalid print writing direction: '+dir+'. \'rtl\' is used','warning',true);
            this.table.print('ltr');
        }
    },
    /**
     * Returns the number of currently active page. If pagination is not 
     * enabled, the function will return 0.
     * @returns {Number}
     */
    getActivePage:function(){
        if(this.obj.active !== undefined){
            return this.obj.active;
        }
        return 0;
    },
    /**
     * Checks if selective search is enabled or not.
     * @returns {Boolean} True if enabled. False otherwise.
     */
    isSelectiveSearchEnabled:function(){
        return this.obj['selective-search'] === true;
    },
    /**
     * Checks if search is enabled or not.
     * @returns {Boolean} True if enabled. False otherwise.
     */
    isSearchEnabled:function(){
        if(this.obj['enable-search'] === true){
            return true;
        }
        return false;
    },
    /**
     * Remove a row given its index.
     * @param {Number} rowIndex The index of the row.
     * @param {Boolean} removeData If set to false, the row will be only removed 
     * from the GUI which means it can appear again at some point in case of 
     * sorting or searching.
     * @returns {Boolean|Object} An object that contains row data if removed. False 
     * If not removed.
     */
    removeRow:function(rowIndex){
        this.log('DataTable.removeRow: Row index: '+rowIndex,'info');
        this.log('DataTable.removeRow: Checking index validity','info');
        if(rowIndex >= 0 && rowIndex < this.rows()){
            this.log('DataTable.removeRow: Searching for the row.','info');
            for(var x = 0 ; x < this.rows() ; x++){
                if(this.getData()[x]['row-index'] === rowIndex){
                    this.log('DataTable.removeRow: Row found at x = '+x,'info');
                    this.log('DataTable.removeRow: Removing row from data','info');
                    var rowData = this.obj.data.splice(x,1)[0];
                    this.log(rowData);
                    this.log('DataTable.removeRow: Row Index = '+rowData['row-index'],'info');
                    this.log('DataTable.removeRow: Removing row from UI','info');
                    var tr = this.t_body.children[rowData['row-index']];
                    this.t_body.removeChild(tr);
                    this.log('DataTable.removeRow: Updating other rows indices','info');
                    if(this.rows() === 0){
                        this.validateDataState();
                    }
                    else{
                        for(var y = x ; y < this.rows() ; y++){
                            if(this.getData()[y]['row-index'] !== -1){
                                this.getData()[y]['row-index']--;
                            }
                        }
                    }
                    this.log('DataTable.removeRow: Updating finished','info');
                    this.log('DataTable.removeRow: Firing onrowremoved event','info');
                    if(typeof this.obj.events.onrowremoved === 'function'){
                        this.obj.events.datatable = this;
                        this.obj.events['row-data'] = rowData;
                        this.obj.events.index = x;
                        this.obj.events.tr = tr;
                        this.obj.events.onrowremoved();
                        delete this.obj.events.datatable;
                        delete this.obj.events['row-data'];
                        delete this.obj.events.index;
                        delete this.obj.events.tr;
                        this.log('DataTable.removeRow: Event completed.','info');
                    }
                    else{
                        this.log('DataTable.removeRow: No event is fired.','info');
                    }
                    this.log('DataTable.removeRow: Returning row data','info');
                    return rowData;
                }
            }
            this.log('DataTable.removeRow: Given row index is not visible in the UI.','info',true);
            return false;
        }
        this.log('DataTable.removeRow: Row index is not in the range [0,'+(this.rows())+')','warning',true);
        return false;
    },
    /**
     * Returns the number of filtered rows based on search keyword.
     * @returns {Number} The number of filtered rows based on search keyword.
     */
    filteredRows:function(){
        var count = 0;
        for(var x = 0 ; x < this.rows() ; x++){
            if(this.getData()[x].show === undefined || this.getData()[x].show === true){
                count++;
            }
        }
        return count;
    },
    /**
     * Returns the key name of the column that is selected as a search column.
     * @returns {String|undefined} The key name of the column that is selected as a search column. 
     * If no column is selected, the function will return undefined.
     */
    getSearchCol:function(){
        return this.obj['search-col'];
    },
    /**
     * Search the table.
     * @param {String} val The value to search for.
     * @returns {undefined}
     */
    search:function(val){
        this.log('DataTable.search: Searching for \''+val+'\'.','info');
        if(this.isSearchEnabled()){
            if(val !== undefined && val !== ''){
                this.log('DataTable.search: Resetting search attribute \'show\'.','info');
                for(var x = 0 ; x < this.rows() ; x++){
                    this.getData()[x]['show'] = false;
                }
                var searchCol = this.getSearchCol();
                var regEx = new RegExp(val,'g');
                if(searchCol !== undefined){
                    this.log('DataTable.search: Searching in the column \''+searchCol.key+'\'.','info');
                    for(var y = 0 ; y < this.rows() ; y++){
                        this.log('DataTable.search: Searching row \''+y+'\'.','info');
                        if(regEx.test(this.getData()[y][searchCol.key]) === true){
                            this.log('DataTable.search: A match is found.','info');
                            this.getData()[y]['show'] = true;
                        }
                    }
                }
                else{
                    var searchCols = this.getSearchColsKeys();
                    for(var x = 0 ; x < searchCols.length ; x++){
                        this.log('DataTable.search: Searching in the column \''+searchCols[x]+'\'.','info');
                        for(var y = 0 ; y < this.rows() ; y++){
                            this.log('DataTable.search: Searching row \''+y+'\'.','info');
                            if(regEx.test(this.getData()[y][searchCols[x]]) === true){
                                this.log('DataTable.search: A match is found.','info');
                                this.getData()[y]['show'] = true;
                            }
                        }
                    }
                }
                this.rowCountChanged();
            }
            else{
                this.log('DataTable.search: Nothing to search for.','info');
                for(var x = 0 ; x < this.rows() ; x++){
                    this.getData()[x]['show'] = true;
                }
                this.rowCountChanged();
            }
        }
        else{
            this.log('DataTable.search: Search is disabled.','info');
        }
    },
    /**
     * Sets the label that is displayed in the print button.
     * @param {String} label The text to set.
     * @returns {undefined}
     */
    setPrintLabel:function(label){
        if(this.isPrintable()){
            if(label !== undefined){
                this.print_button.innerHTML = label+'';
                this.obj.lang['print-label'] = this.search_label.innerHTML;
            }
            else{
                this.print_button.innerHTML = 'Print Table';
                this.obj.lang['print-label'] = this.print_button.innerHTML;
                this.log('DataTable.setPrintLabel: Undefined is given. Default will be used.','warning');
            }
            this.log('DataTable.sePrintLabel: Label updated to \''+this.obj.lang['print-label']+'\'.','info');
        }
        else{
            this.log('DataTable.sePrintLabel: Print is disabled.','info');
        }
    },
    /**
     * Sets the label that is displayed along side the combobox that is used to 
     * select search column.
     * @param {String} label The text to set.
     * @returns {undefined}
     */
    setSelectColLabel:function(label){
        if(this.isSelectiveSearchEnabled()){
            if(label !== undefined){
                this.col_select.children[0].innerHTML = label+'';
                this.obj.lang['select-col-label'] = this.col_select.children[0].innerHTML;
            }
            else{
                this.col_select.children[0].innerHTML = 'Select a column...';
                this.obj.lang['select-col-label'] = this.col_select.children[0].innerHTML;
                this.log('DataTable.setSelectColLabel: Undefined is given. Default will be used.','warning');
            }
            this.log('DataTable.setSelectColLabel: Label updated to \''+this.obj.lang['select-col-label']+'\'.','info');
        }
        else{
            this.log('DataTable.setSelectColLabel: Selective search is disabled.','info');
        }
    },
    /**
     * Sets the label that is displayed along side the textbox that is used to 
     * search the table.
     * @param {String} label The text to set.
     * @returns {undefined}
     */
    setSearchLabel:function(label){
        if(this.isSearchEnabled()){
            if(label !== undefined){
                this.search_label.innerHTML = label+'';
                this.obj.lang['search-label'] = this.search_label.innerHTML;
            }
            else{
                this.search_label.innerHTML = 'Search:';
                this.obj.lang['search-label'] = this.search_label.innerHTML;
                this.log('DataTable.setSearchLabel: Undefined is given. Default will be used.','warning');
            }
            this.log('DataTable.setSearchLabel: Label updated to \''+this.obj.lang['search-label']+'\'.','info');
        }
        else{
            this.log('DataTable.setSearchLabel: Search is disabled.','info');
        }
    },
    /**
     * Checks if table has data or not. If no data is visible, 
     * display 'no data' cell.
     * @returns {undefined}
     */
    validateDataState:function(){
        try{
            this.noDataRow.children[0].colSpan = this.cols();
            if(this.rows() === 0 || this.visibleCols() === 0){
                this.t_body.appendChild(this.noDataRow);
            }
            else{
                this.t_body.removeChild(this.noDataRow);
            }
        }
        catch(e){}
    },
    rowCountChanged:function(){
        if(this.rows() > 0){
            var rowsCount = this.rowsPerPage();
            this.log('DataTable.rowCountChanged: Rows per page: '+rowsCount,'info');
            this.obj.start = 0;
            this.log('DataTable.rowCountChanged: Start row updated to '+this.obj.start,'info');
            if(rowsCount > this.filteredRows()){
                this.obj.end = this.filteredRows();
                this.log('DataTable.rowCountChanged: Rows count > '+this.filteredRows(),'info');
            }
            else{
                this.obj.end = rowsCount;
            }
            this.log('DataTable.rowCountChanged: End row updated to '+this.obj.end,'info');
            this.log('DataTable.rowCountChanged: Calling the function \'displayPage()\'','info');
            this.displayPage();
            var pagesCount = this.pagesCount();
            
            while(this.numbersContainer.children.length !== 0){
                this.numbersContainer.removeChild(this.numbersContainer.children[0]);
            }
            
            var inst = this;
            if(pagesCount === 0){
                pagesCount = 1;
            }
            for(var x = 0 ; x < pagesCount ; x++){
                var button = document.createElement('button');
                var pageNumber = (x + 1);
                button.innerHTML = pageNumber;
                this.numbersContainer.appendChild(button);
                if(x === 0){
                    button.className = 'active';
                    this.obj.active = 0;
                }
                button.onclick = function(){
                    var pageNumber = Number.parseInt(this.innerHTML);
                    var start = (pageNumber - 1)*rowsCount;
                    var end = start + inst.rowsPerPage();
                    if(end > inst.filteredRows()){
                        end = end - (end - inst.filteredRows());
                    }
                    inst.obj.start = start;
                    inst.obj.end = end;
                    inst.pageNumberContainer.children[2].children[inst.obj.active].className = '';
                    inst.obj.active = pageNumber - 1;
                    inst.pageNumberContainer.children[2].children[inst.obj.active].className = 'active';
                    inst.displayPage();
                };
            }
        }
        this.validateDataState();
    },
    /**
     * Sets the label that is displayed along side the combobox that is used to 
     * select how many rows to show in each page.
     * @param {String} label The text to set.
     * @returns {undefined}
     */
    setShowSelectLabelText:function(label){
        if(this.isPaginationEnabled()){
            if(label !== undefined){
                this.rowCountSelectLabel.innerHTML = label+'';
                this.obj.lang['show-label'] = this.rowCountSelectLabel.innerHTML;
            }
            else{
                this.log('DataTable.setShowSelectLabelText: Undefined is given. Default will be used.','warning');
                this.rowCountSelectLabel.innerHTML = 'Show:';
                this.obj.lang['show-label'] = this.rowCountSelectLabel.innerHTML;
            }
            this.log('DataTable.setShowSelectLabelText: Label updated to \''+this.obj.lang['show-label']+'\'.','info');
        }
        else{
            this.log('DataTable.setShowSelectLabelText: Pagination is disabled.','info');
        }
    },
    /**
     * Sets the label that is displayed when no rows are being displayed.
     * @param {String} label The text to set.
     * @returns {undefined}
     */
    setNoDataText:function(label){
        if(label !== undefined){
            this.noDataRow.children[0].innerHTML = label+'';
            this.obj.lang['no-data-label'] = this.noDataRow.children[0].innerHTML;
        }
        else{
            this.noDataRow.children[0].innerHTML = 'NO DATA';
            this.obj.lang['no-data-label'] = this.noDataRow.children[0].innerHTML;
            this.log('DataTable.setNoDataText: Undefined is given. Default will be used.','warning');
        }
        this.log('DataTable.setNoDataText: Label updated to \''+this.obj.lang['no-data-label']+'\'.','info');
    },
    /**
     * A function to call in case selected page is changed (for pagination).
     * @returns {undefined}
     */
    displayPage:function(){
        this.log('DataTable.displayPage: Removing All visible Rows (UI only).','info');
        while(this.t_body.children.length !== 0){
            this.log('DataTable.displayPage: Number of remaining rows: '+this.t_body.children.length,'info');
            this.removeRow(0);
        }
        this.log('DataTable.displayPage: All rows removed.','info');
        this.log('DataTable.displayPage: Adding Rows.','info');
        this.log('DataTable.displayPage: Start = '+this.obj.start+', End = '+this.obj.end,'info');
        var rowsCount = this.obj.start;
        for(var x = this.obj.start ; x < this.obj.end ; x++){
            if(x < this.rows() && this.obj.end <= this.rows()){
                if(this.obj.data[x].show === undefined || this.obj.data[x].show === true){
                    this.obj.data[x]['row-index'] = rowsCount;
                    rowsCount++;
                    this.log('DataTable.displayPage: Adding row '+x+'.','info');
                    this.addRow(this.obj.data[x],false);
                }
                else{
                    this.log('DataTable.displayPage: Skipping row '+x+'.','info');
                    this.obj.data[x]['row-index'] = -1;
                    this.obj.start++;
                    this.obj.end++;
                }
            }
        }
        this.log('DataTable.displayPage: Finished. Returning back.');
    },
    /**
     * Loging function. Used in stage of development.
     * @param {Mixed} message The message to display.
     * @param {String} type The type of the message. it can be 'warning', 'info' 
     * or 'error'.
     * @param {Boolean} force If set to true and the logging is disabled, the 
     * message will be shown.
     * @returns {undefined}
     */
    log:function(message,type='',force=false){
        if(this.obj['enable-log'] === true || force===true){
            if(type==='info'){
                console.info(message);
            }
            else if(type==='warning'){
                console.warn(message);
            }
            else if(type==='error'){
                console.error(message);
            }
            else{
                console.log(message);
            }
        }
    },
    /**
     * Returns the number of pages in the table (Used in case of pagiation).
     * @returns {Number}
     */
    pagesCount:function(){
        var totalRows = this.filteredRows();
        var rowsToDisplay = this.rowsPerPage();
        return Math.ceil(totalRows/rowsToDisplay);
    },
    /**
     * Returns the number of rows per page. If pagination is disabled, the 
     * function will return the total number of rows.
     * @returns {Number} The number of rows per page. The value is taken from 
     * rows per page combobox.
     */
    rowsPerPage:function(){
        if(this.obj['paginate'] === true){
            var count = Number.parseInt(this.rowCountSelect.value);
            if(!Number.isNaN(count)){
                return count;
            }
            return 10;
        }
        else{
            return this.rows();
        }
    },
    /**
     * Returns the number of rows to display per page.
     * @returns {Number}
     */
    rowsToDisplay:function(){
        if(this.obj.paginate === true){
            var count = Number.parseInt(this.rowCountSelect.value);
            if(this.obj.end !== undefined){
                if((this.obj.end + count) < this.rows()){
                    return count;
                }
                return this.filteredRows() - this.obj.end;
            }
            else{
                return count;
            }
        }
    },
    /**
     * Checks if a column is hidden or not given its index or key.
     * @param {String|Number} colKeyOrIndex The key or the index of the column. 
     * @returns {Boolean} True if the column is hidden. False if not. 
     * If no column is found, the function will return false.
     */
    isColumnHidden:function(colKeyOrIndex){
        if(typeof colKeyOrIndex === 'number'){
            if(colKeyOrIndex >= 0 && colKeyOrIndex < this.cols()){
                return this.obj.cols[colKeyOrIndex].hidden === true;
            }
        }
        else if(typeof colKeyOrIndex === 'string'){
            var cols = this.getCols();
            for(var x = 0 ; x < cols.length ; x++){
                if(cols[x].key === colKeyOrIndex){
                    return cols[x].hidden === true;
                }
            }
        }
        this.log('DataTable.isColumnHidden: Invalid column name or index: '+colKeyOrIndex,'info');
        return false;
    },
    /**
     * Sets the value at the given row and column.
     * @param {String|Number} colIndexOrKey Column key or index.
     * @param {Number} row Row index.
     * @param {Mixed} val The value to set.
     * @returns {Boolean} True if the value is set. False otherwise.
     */
    set:function(colIndexOrKey,row,val){
        this.log('DataTable.set: Updating value at col \''+colIndexOrKey+'\' , row \''+row+'\' to \''+val+'\'','info');
        var rowsCount = this.rows();
        this.log('DataTable.set: Validating row index.','info');
        if(row >= 0 && row < rowsCount){
            this.log('DataTable.set: Checking column index type.','info');
            if(typeof colIndexOrKey === 'number'){
                this.log('DataTable.set: Column index is a number.','info');
                this.log('DataTable.set: Validating column index.','info');
                var colsCount = this.cols();
                if(colIndexOrKey >= 0 && colIndexOrKey < colsCount){
                    var type = typeof val;
                    var col = this.getColumn(colIndexOrKey);
                    var colDatatype = col.type;
                    this.log('DataTable.set: Validating datatype.','info');
                    if(type === colDatatype){
                        for(var x = 0 ; x < rowsCount ; x++){
                            for(var y = 0 ; y < colsCount ; y++){
                                if(x === row && y === colIndexOrKey){
                                    var colKey = this.getColumn(colIndexOrKey).key;
                                    this.log('DataTable.set: Updating value at column \''+colKey+'\' row \''+row+'\'.','info');
                                    this.obj.data[x][colKey] = val;
                                    this.log('DataTable.set: Updating UI','info');
                                    for(var n = 0 ; n < this.visibleRows() ; n++){
                                        for(var z = 0 ; z < this.rows() ; z++){
                                            if(this.getData()[x]['row-index'] === n){
                                                if(type === 'string' || type === 'number'){
                                                    this.t_body.children[n].children[col.index].innerHTML = val;
                                                }
                                                else if(type === 'boolean'){
                                                    this.t_body.children[n].children[col.index].children[0].checked = val;
                                                }
                                                break;
                                            }
                                        }
                                    }
                                    return true;
                                }
                            }
                        }
                    }
                    else{
                        this.log('DataTable.set: Invalid column data type: '+type,'warning');
                        this.log('DataTable.set: The column \''+colIndexOrKey+'\' can only accept '+colDatatype,'info');
                    }
                }
                else{
                    this.log('DataTable.set: Invalid column index: '+colIndexOrKey,'info');
                }
            }
            else if(this.hasCol(colIndexOrKey)){
                this.log('DataTable.set: It is a key.','info');
                var type = typeof val;
                var col = this.getColumn(colIndexOrKey);
                var colDatatype = col.type;
                this.log('DataTable.set: Validating col data type.','info');
                if(type === colDatatype){
                    this.log('DataTable.set: Valid data type.','info');
                    for(var x = 0 ; x < rowsCount ; x++){
                        if(x === row){
                            this.obj.data[x][colIndexOrKey] = val;
                            for(var n = 0 ; n < this.visibleRows() ; n++){
                                for(var z = 0 ; z < this.rows() ; z++){
                                    if(this.getData()[x]['row-index'] === n){
                                        if(type === 'string' || type === 'number'){
                                            this.t_body.children[n].children[col.index].innerHTML = val;
                                        }
                                        else if(type === 'boolean'){
                                            this.t_body.children[n].children[col.index].children[0].checked = val;
                                        }
                                        break;
                                    }
                                }
                            }
                            return true;
                        }
                    }
                }
                else{
                    this.log('DataTable.set: Invalid column data type: '+type,'warning');
                    this.log('DataTable.set: The column \''+colIndexOrKey+'\' can only accept '+colDatatype,'info');
                }
            }
            else{
                this.log('DataTable.set: Invalid column: '+colIndexOrKey,'warning');
            }
        }
        else{
            this.log('DataTable.set: Invalid row index: '+row,'warning');
        }
        return false;
    },
    /**
     * Returns the index of a colum given its key.
     * @param {String} colKey The name of the column key.
     * @returns {Number} The index of the column. If no column is found, the 
     * function will return -1.
     */
    getColIndex:function(colKey){
        var cols = this.getCols();
        for(var x = 0 ; x < cols.length ; x++){
            if(cols[x].key === colKey){
                return cols[x].index;
            }
        }
        this.log('DataTable.getColIndex: No such column: '+colKey);
        return -1;
    },
    /**
     * Sets the title of the column.
     * @param {Number|String} ccolKeyOrIndex The index of the column or its key.
     * @param {String} val The new title.
     * @returns {undefined}
     */
    setColTitle:function(colKeyOrIndex,val){
        this.log('DataTable.setColTitle: Checking index type.','info');
        if(typeof colKeyOrIndex === 'number'){
            this.log('DataTable.setColTitle: Column index is given.','info');
            this.log('DataTable.setColTitle: Checking index validity.','info');
            if(colKeyOrIndex >= 0 && colKeyOrIndex < this.cols()){
                this.log('DataTable.setColTitle: Valid index.','info');
                this.log('DataTable.setColTitle: Updating title.','info');
                this.obj.cols[colKeyOrIndex].title = val;
                if(this.hasHeader()){
                    this.log('DataTable.setColTitle: Updating header.','info');
                    this.t_h_row.children[colKeyOrIndex].innerHTML = val;
                }
                if(this.hasFooter()){
                    this.log('DataTable.setColTitle: Updating footer.','info');
                    this.t_f_row.children[colKeyOrIndex].innerHTML = val;
                }
                this.log('DataTable.setColTitle: Returing true.','info');
                return true;
            }
            else{
                this.log('DataTable.setColTitle: Invalid column index: '+colKeyOrIndex,'warning',true);
            }
        }
        else if(typeof colKeyOrIndex === 'string'){
            this.log('DataTable.setColTitle: Column key is given.','info');
            this.log('DataTable.setColTitle: Getting column index.','info');
            var colIndex = this.getColIndex(colKeyOrIndex);
            if(colIndex !== -1){
                this.log('DataTable.setColTitle: Column index = '+colIndex,'info');
                this.log('DataTable.setColTitle: Updating title.','info');
                this.obj.cols[colIndex].title = val;
                if(this.hasHeader()){
                    this.log('DataTable.setColTitle: Updating header.','info');
                    this.t_h_row.children[colIndex].innerHTML = val;
                }
                if(this.hasFooter()){
                    this.log('DataTable.setColTitle: Updating footer.','info');
                    this.t_f_row.children[colIndex].innerHTML = val;
                }
                this.log('DataTable.setColTitle: Returing true.','info');
                return true;
            }
            else{
                this.log('DataTable.setColTitle: Invalid column key: '+colKeyOrIndex,'warning',true);
            }
        }
        this.log('DataTable.setColTitle: Reurning false.','info');
        return false;
    },
    /**
     * Returns an object that contains column information given its index or key.
     * @param {String|Number} colKeyOrIndex The index of the column or its key.
     * @returns {Object|undefined} An object that contains column information. If no 
     * column is found, the function will return undefined.
     */
    getColumn:function(colKeyOrIndex){
        this.log('DataTable.getColumn: Checking index type.','info');
        if(typeof colKeyOrIndex === 'number'){
            this.log('DataTable.getColumn: An index is given.','info');
            this.log('DataTable.getColumn: Checking index validity.','info');
            if(colKeyOrIndex >= 0 && colKeyOrIndex < this.cols()){
                this.log('DataTable.getColumn: Valid index.','info');
                this.log('DataTable.getColumn: Returning the column object.','info');
                return this.obj.cols[colKeyOrIndex];
            }
            else{
                this.log('DataTable.getColumn: Invalid col index: '+colKeyOrIndex,'warning',true);
            }
        }
        else if(typeof colKeyOrIndex === 'string'){
            this.log('DataTable.getColumn: A key is given.','info');
            this.log('DataTable.getColumn: Getting column index.','info');
            var colIndex = this.getColIndex(colKeyOrIndex);
            if(colIndex !== -1){
                this.log('DataTable.getColumn: Col index = '+colIndex,'info');
                this.log('DataTable.getColumn: Returning the column object.','info');
                return this.obj.cols[colIndex];
            }
            else{
                this.log('DataTable.getColumn: Invalid col key: '+colKeyOrIndex,'warning',true);
            }
        }
        this.log('DataTable.getColumn: Returning undefined.','info');
        return undefined;
    },
    /**
     * Returns a string that represents the datatype the column contains 
     * given its index or key.
     * @param {String|Number} colKeyOrIndex The index of the column or its key.
     * @returns {String|undefined} A string such as 'boolean' or 'string'. If no 
     * column is found, the function will return undefined.
     */
    getColDataType:function(colIndexOrKey){
        var col = this.getColumn(colIndexOrKey);
        if(col !== undefined){
            return col.type;
        }
        this.log('DataTable.getColDataType: Invalid column name or index: '+colIndexOrKey,'warning',true);
        return undefined;
    },
    /**
     * Returns the default value of the column.
     * @param {String|Number} colKeyOrIndex The index of the column or its key.
     * @returns {undefined|Mixed} The default value of the column. If no column is 
     * found, the function will return undefined.
     */
    getColDefault:function(colKeyOrIndex){
        var col = this.getColumn(colKeyOrIndex);
        if(col !== undefined){
            return col.default;
        }
        this.log('DataTable.getColDefault: No such column: '+colKeyOrIndex+'.','warning',true);
        return undefined;
    },
    /**
     * Sets the default value of a column.
     * @param {String|Number} colKeyOrIndex The index of the column or its key.
     * @param {Object} val An object that has two attributes, one is 'type' which 
     * contains the datatype of the value and the other is 'val' which is the value 
     * to set.
     * @returns {Boolean} True if updated.
     */
    setColDefault:function(colKeyOrIndex,val={type:'string',val:''}){
        if(this.hasCol(colKeyOrIndex)){
            if(typeof val === 'object'){
                var colDataType = this.getColDataType(colKeyOrIndex);
                if(val.type === colDataType){
                    this.getColumn(colKeyOrIndex).default = val.val;
                    return true;
                }
                else{
                    this.log('DataTable.setColDefault: Column datatype does not match provided value type.','info');
                }
            }
            return false;
        }
        this.log('DataTable.setColDefault: No such column: '+colKeyOrIndex,'info');
        return false;
    },
    /**
     * Adds new row to the table.
     * @param {Object} data An object that represents the row.
     * @param {Boolean} storeData If set to true, the data will be kept in the 
     * table (inside obj.data array). Else if false, A row will be added to the UI only. 
     * @returns {undefined}
     */
    addRow:function(data={},storeData=true){
        this.log('DataTable.addRow: Checking if data is an object.','info');
        if(typeof data === 'object'){
            this.log('DataTable.addRow: Setting attribute \'show\' of the row to true.','info');
            data.show = true;
            this.log('DataTable.addRow: Checking if pagination is enabled.','info');
            if(this.obj.paginate === true){
                this.log('DataTable.addRow: It is enabled.','info');
                data['row-index'] = this.rowsPerPage() * this.getActivePage() + this.visibleRows();
            }
            else{
                this.log('DataTable.addRow: It is not enabled.','info');
                data['row-index'] = this.visibleRows();
            }
            this.log('DataTable.addRow: Row index = '+data['row-index'],'info');
            this.log('DataTable.addRow: Checking data keys.','info');
            var keys = Object.keys(data);
            var keyIndex = [];
            //first, extract the data that can be inserted.
            this.log('DataTable.addRow: Extracting data to insert','info');
            for(var x = 0 ; x < keys.length ; x++){
                var index = this.getColIndex(keys[x]);
                if(index === -1){
                    this.log('DataTable.addRow: Key \''+keys[x]+'\' is not a column in the table.','warning');
                }
                else{
                    keyIndex.push({key:keys[x],index:index,datatype:this.getColumn(index).type,visible:!this.isColumnHidden(index)});
                }
            }
            //check missing attributes 
            this.log('DataTable.addRow: Checking keys values.','info');
            var colKeys = this.getColsKeys();
            for(var x = 0 ; x < colKeys.length ; x++){
                var hasValue = false;
                var key = colKeys[x];
                for(var y = 0 ; y < keyIndex.length ; y++){
                    if(keyIndex[y].key === key){
                        this.log('DataTable.addRow: Key \''+key+'\' has a value.','info');
                        hasValue = true;
                    }
                }
                if(!hasValue){
                    this.log('DataTable.addRow: Key \''+key+'\' has no value. Using default.','info',true);
                    var dataType = this.getColDataType(key);
                    var index = this.getColIndex(key);
                    keyIndex.push({key:key,index:index,datatype:dataType});
                    data[key] = this.getColDefault(key);
                }
            }
            this.log('DataTable.addRow: Checking if there is a visible column.','info');
            //check if all columns are hidden or not
            var allHidden = true;
            for(var x = 0 ; x < keyIndex.length ; x++){
                allHidden = allHidden && !keyIndex[x].visible;
            }
            if(!allHidden){
                //start adding data
                this.log('DataTable.addRow: Checking if there are values to add.','info');
                if(keyIndex.length !== 0){
                    this.log('DataTable.addRow: Creating new row.','info');
                    var dataObj = {};
                    var row = document.createElement('tr');
                    var colCount = this.cols();
                    this.log('DataTable.addRow: Creating row cells.','info');
                    for(var x = 0 ; x < colCount ; x++){
                        this.log('DataTable.addRow: Creating \'td\' element.','info');
                        var cell = document.createElement('td');
                        this.log('DataTable.addRow: Searching for col value.','info');
                        for(var y = 0 ; y < keyIndex.length ; y++){
                            var val = data[keyIndex[y].key];
                            dataObj[keyIndex[y].key] = val;
                            if(keyIndex[y].index === x){
                                this.log('DataTable.addRow: Column value found.','info');
                                this.log('DataTable.addRow: Cell value: \''+val+'\'.','info');
                                //check if column is printable or not
                                this.log('DataTable.addRow: Checking if column \''+keyIndex[y].key+'\' is printable.','info');
                                if(!this.isColPrintable(keyIndex[y].key)){
                                    this.log('DataTable.addRow: It is not printable. Setting class name of the \'td\' element to \'no-print\'','info');
                                    cell.className = 'no-print';
                                }
                                else{
                                    this.log('DataTable.addRow: The column is printable.','info');
                                }
                                this.log('DataTable.addRow: Checking if column \''+keyIndex[y].key+'\' is hidden or not.','info');
                                //check if column is hidden or not
                                if(this.isColumnHidden(keyIndex[y].key)){
                                    cell.className = cell.className+' hidden';
                                    this.log('DataTable.addRow: The column is hidden.','info');
                                }
                                else{
                                    this.log('DataTable.addRow: The column is not hidden.','info');
                                }
                                var type = typeof val;
                                if(type === keyIndex[y].datatype){
                                    if(type === 'string' || type === 'number'){
                                        if(keyIndex[y].key === 'row-index'){
                                            cell.innerHTML = (data[keyIndex[y].key] + 1);
                                            dataObj[keyIndex[y].key] = cell.innerHTML;
                                        }
                                        else{
                                            cell.innerHTML = data[keyIndex[y].key];
                                            dataObj[keyIndex[y].key] = cell.innerHTML;
                                        }
                                    }
                                    else if(type === 'boolean'){
                                        this.log('DataTable.addRow: Adding checkbox.','info');
                                        var input = document.createElement('input');
                                        input.type = 'checkbox';
                                        input.row = this.getActivePage()*this.rowsPerPage() + this.visibleRows();
                                        input.col = x;
                                        this.log('DataTable.addRow: Checkbox row index = '+input.row+'.','info');
                                        this.log('DataTable.addRow: Checkbox column index = '+input.col+'.','info');
                                        var inst = this;
                                        input.onchange = function(){
                                            inst.log('DataTable: Check box value changed to '+this.checked,'info');
                                            inst.log('DataTable: Row index = '+this.row,'info',true);
                                            inst.log('DataTable: Column Index = '+this.col,'info',true);
                                            for(var x = 0 ; x < inst.rows() ; x++){
                                                if(inst.getData()[x]['row-index'] === this.row){
                                                    inst.log('DataTable: Updating value at column \''+this.col+'\', row \''+x+'\'.','info');
                                                    inst.set(this.col,x,this.checked);
                                                }
                                            }
                                        };
                                        if(val === true){
                                            input.checked = true;
                                        }
                                        cell.appendChild(input);

                                    }
                                }
                            }
                        }
                        row.appendChild(cell);
                    }
                    if(storeData === true){
                        this.log('DataTable.addRow: Storing data.','info');
                        this.obj.data.push(dataObj);
                    }
                    this.t_body.appendChild(row);
                    this.log('DataTable.addRow: Row added.','info');
                    this.validateDataState();
                    this.log('DataTable.addRow: Firing onrowadded event.','info');
                    if(typeof this.obj.events.onrowadded === 'function'){
                        this.obj.events.datatable = this;
                        this.obj.events.tr = row;
                        this.obj.events['row-data'] = dataObj;
                        this.obj.events.onrowadded();
                        delete this.obj.events['row-data'];
                        delete this.obj.events.tr;
                        delete this.obj.events.datatable;
                        this.log('DataTable.addRow: Event finished.','info');
                    }
                    else{
                        this.log('DataTable.addRow: No event is fired.','info');
                    }
                }
                else{
                    this.log('DataTable.addRow: No row added. No values found.','info');
                }
            }
            else{
                this.log('DataTable.addRow: No row added. Columns are hidden','info');
            }
        }
        else{
            this.log('DataTable.addRow: Given data is not an object.','warning',true);
        }
    },
    /**
     * Sets a function to call after a row is added.
     * @param {Function} func The function to set.
     * @returns {undefined}
     */
    setOnRowAdded:function(func){
        if(typeof func === 'function'){
            this.obj.events.onrowadded = func;
        }
        else{
            this.log('DataTable.setOnRowAdded: Provided parameter is not a function.','warning',true);
        }
    },
    /**
     * Checks if the column is printable or not.
     * @param {String|Number} colKeyOrIndex The index of the column or its key.
     * @returns {Boolean} True if the column will appear in the print area.
     */
    isColPrintable:function(colKeyOrIndex){
        var col = this.getColumn(colKeyOrIndex);
        if(col !== undefined){
            return col['printable'] !== false;
        }
        return false;
    },
    /**
     * Returns the sum of visible columns widthes in percentage.
     * @returns {Number} The sum of visible columns widthes in percentage.
     */
    colsWidth:function(){
        var width = 0;
        for(var x = 0 ; x < this.cols() ; x++){
            var col = this.getColumn(x);
            if(col.hidden === false || col.hidden === undefined){
                width += col.width;
            }
        }
        return width;
    },
    /**
     * Adds new column to the table.
     * @param {Object} col An object that represents the column. 
     * Each object can have the following attributes:
     * <ul>
     * <li><b>key</b>: A unique name for the column. The key is used in case of adding new 
     * row to the table.</li>
     * <li><b>title</b>: A text to show in the header and the footer of the column.</li>
     * <li><b>width</b>: The width of the column in percentage.</li>
     * <li><b>sortable</b>: A boolean value. If set to true, the rows of the column will 
     * be sortable. Default is false.</li>
     * <li><b>search-enabled</b>: A boolean value. if set to true, the user will be able to search 
     * the data on the column. Default is false.</li>
     * <li><b>printable</b>: A boolean value. If set to true, The column will appear in case 
     * of printing. Default is true.</li>
     * </ul>
     * @returns {undefined}
     */
    addColumn:function(col={}){
        this.log('DataTable.addColumn: Checking if parameter \'col\' is an object.','info');
        if(typeof col === 'object'){
            this.log('DataTable.addColumn: Checking if attribute \'key\' is set.','info');
            if(col.key !== undefined){
                col.key = ''+col.key;
                this.log('DataTable.addColumn: Checking if attribute \'key\' is not an empty string.','info');
                if(col.key.length > 0){
                    this.log('DataTable.addColumn: Checking if column already in the table or not.','info');
                    if(!this.hasCol(col.key)){
                        this.log('DataTable.addColumn: Checking print state of the column','info');
                        if(col.printable === undefined){
                            col.printable = true;
                        }
                        col.index = this.cols();
                        this.log('DataTable.addColumn: Defining attribute \'index\' [index = '+col.index+'].','info');
                        this.log('DataTable.addColumn: Creating \'col\' HTML element.','info');
                        var colSetCol = document.createElement('col');
                        this.log('DataTable.addColumn: Setting column span.','info');
                        colSetCol.span = '1';
                        this.log('DataTable.addColumn: Checking attribute \'width\' of the column.','info');
                        if(col.width !== undefined){
                            if(col.width <= 100 && col.width > 0){
                                colSetCol.width = col.width+'%';
                                this.log('DataTable.addColumn: Column width: '+colSetCol.width+'.','info');
                            }
                            else{
                                this.log('DataTable.addColumn: Invalid Column width: '+col.width+'. 10% is used as default.','warning',true);
                                colSetCol.width = '10%';
                                col.width = 10;
                            }
                        }
                        else{
                            this.log('DataTable.addColumn: Column width not specifyed. 10% is used as default.','warning','info');
                            colSetCol.width = '10%';
                            col.width = 10;
                        }
                        this.log('DataTable.addColumn: Appending \'col\' element to the \'colgroup\' element.','info');
                        this.col_set.appendChild(colSetCol);
                        this.log('DataTable.addColumn: Checking if table has header.','info');
                        if(this.hasHeader()){
                            this.log('DataTable.addColumn: Creating \'th\' HTML element.','info');
                            var hCell = document.createElement('th');
                            this.log('DataTable.addColumn: Checking attribute \'sortable\' of the column.','info');
                            if(col.sortable === true){
                                this.log('DataTable.addColumn: It is set to \'true\'.','info');
                                this.log('DataTable.addColumn: Setting attribute \'role\' of \'th\' element to \'sort-button\'.','info');
                                hCell.setAttribute('role','sort-button');
                                hCell.dataTable = this;
                                var colNum = this.getCols().length !== 0 ? this.getCols().length : 0;
                                this.log('DataTable.addColumn: Getting column number [number = '+colNum+']','info');
                                this.log('DataTable.addColumn: Initializing sort event \'th.onclick\'.','info');
                                hCell.onclick = function(){
                                    this.dataTable.sort(colNum);
                                };
                            }
                            this.log('DataTable.addColumn: Checking attribute \'title\' of the column.','info');
                            if(col.title !== undefined){
                                this.log('DataTable.addColumn: Setting \'th\' inner html to \''+col.title+'\'.','info');
                                hCell.innerHTML = col.title;
                            }
                            else{
                                hCell.innerHTML = 'Col-'+this.getCols().length;
                                col.title = hCell.innerHTML;
                                this.log('DataTable.addColumn: The atribute \'title\' is undefined. Column title set to \''+col.title+'\'.','warning',true);
                            }
                            this.log('DataTable.addColumn: Adding \'th\' element to header row.','info');
                            this.t_h_row.appendChild(hCell);
                        }
                        this.log('DataTable.addColumn: Checking if table has footer.','info');
                        if(this.hasFooter()){
                            this.log('DataTable.addColumn: Creating \'th\' HTML element for the footer.','info');
                            var fCell = document.createElement('th');
                            fCell.innerHTML = col.title;
                            this.log('DataTable.addColumn: Adding \'th\' element to footer row.','info');
                            this.t_f_row.appendChild(fCell);
                        }
                        this.log('DataTable.addColumn: Checking if column is printable or not.','info');
                        if(col.printable === false){
                            this.log('DataTable.addColumn: It is not printable.','info');
                            colSetCol.className = 'no-print';
                            if(this.hasHeader()){
                                hCell.className = 'no-print';
                            }
                            if(this.hasFooter()){
                                fCell.className = 'no-print';
                            }
                        }
                        else{
                            this.log('DataTable.addColumn: It is printable.','info');
                        }
                        this.log('DataTable.addColumn: Checking if the column is hidden or not.','info');
                        if(col.hidden === true){
                            this.log('DataTable.addColumn: It is hidden.','info');
                            colSetCol.className = colSetCol.className+' hidden';
                            if(this.hasHeader()){
                                hCell.className = hCell.className+' hidden';
                            }
                            if(this.hasFooter()){
                                fCell.className = fCell.className+' hidden';
                            }
                        }
                        else{
                            this.log('DataTable.addColumn: It is not hidden.','info');
                        }
                        this.log('DataTable.addColumn: Checking if search in the column is enabled.','info');
                        if(col['search-enabled'] === true){
                            this.log('DataTable.addColumn: Checking if search and selective serach is enabled.','info');
                            if(this.isSearchEnabled() && this.isSelectiveSearchEnabled()){
                                this.log('DataTable.addColumn: Creating \'option\' element for selective search.','info');
                                var o = document.createElement('option');
                                o.innerHTML = col.title;
                                o.value = col.key;
                                this.log('DataTable.addColumn: Appending \'option\' element to select element.','info');
                                this.col_select.appendChild(o);
                            }
                        }
                        this.log('DataTable.addColumn: Checking attribute \'type\'.','info');
                        if(DataTable.SUPPORTED_DATATYPES.indexOf(col.type) === -1){
                            this.log('DataTable.addColumn: Unsupported datatype: '+col.type+'. Default is used (string)','warning',true);
                            col.type = 'string';
                            if(col.default !== undefined){
                                col.default = ''+col.default;
                            }
                        }
                        this.log('DataTable.addColumn: Checking attribute \'default\'.','info');
                        if(col.default === undefined){
                            this.log('DataTable.addColumn: No default value for the column is provided.','warning',true);
                            if(col.type === 'string'){
                                col.default = '-';
                                this.log('DataTable.addColumn: \'-\' is used as default value.','info',true);
                            }
                            else if(col.type === 'number'){
                                col.default = 0;
                                this.log('DataTable.addColumn: \'0\' is used as default value.','info',true);
                            }
                            else if(col.type === 'boolean'){
                                col.default = false;
                                this.log('DataTable.addColumn: \'false\' is used as default value.','info',true);
                            }
                        }
                        this.log('DataTable.addColumn: Appending column to set of columns.','info,');
                        this.obj.cols.push(col);
                        this.log('DataTable.addColumn: Adding empty cells for the column.','info');
                        for(var x = 0 ; x < this.rows() ; x++){
                            this.getData()[x][col.key] = col.default;
                            var cell = document.createElement('td');
                            cell.innerHTML = col.default;
                            this.t_body.children[x].appendChild(cell);
                        }
                        this.log('DataTable.addColumn: New column added.',true);
                        this.validateDataState();
                        this.log('DataTable.addColumn: Firing oncoladded.',true);
                        if(typeof this.obj.events.oncoladded === 'function'){
                            this.obj.events.datatable = this;
                            this.obj.events['col-data'] = col;
                            this.obj.events.col = colSetCol;
                            if(this.hasFooter()){
                                this.obj.events.fcell = fCell;
                            }
                            if(this.hasHeader()){
                                this.obj.events.hcell = hCell;
                            }
                            this.obj.events.oncoladded();
                            delete this.obj.events.datatable;
                            delete this.obj.events['col-data'];
                            delete this.obj.events.col;
                            delete this.obj.events.fcell;
                            delete this.obj.events.hcell;
                            this.log('DataTable.addColumn: Event completed.',true);
                        }
                        else{
                            this.log('DataTable.addColumn: No event is fired.',true);
                        }
                        
                    }
                    else{
                        this.log('DataTable.addColumn: A column was already added with key = '+col.key,'warning',true);
                        this.log('DataTable.addColumn: No column is added.','info');
                    }
                }
                else{
                    this.log('DataTable.addColumn: Invalid column key: '+col.key,'warning',true);
                    this.log('DataTable.addColumn: No column is added.','info');
                }
            }
            else{
                this.log('DataTable.addColumn: The attribute \'key\' is missing.','warning',true);
                this.log('DataTable.addColumn: No column is added.','info');
            }
        }
        else{
            this.log('DataTable.addColumn: The given parameter is not an object.','warning',true);
            this.log('DataTable.addColumn: No column is added.','info');
        }
        this.log('DataTable.addColumn: Return back','info');
    },
    /**
     * Sets a function to call after a column is added.
     * @param {Function} func The function to set.
     * @returns {undefined}
     */
    setOnColAdded:function(func){
        if(typeof func === 'function'){
            this.obj.events.oncoladded = func;
        }
        else{
            this.log('DataTable.setOnRowRemoved: Given parameter is not a function.','warning',true);
        }
    },
    /**
     * Checks if a given column is in the table or not.
     * @param {type} colKeyOrIndex
     * @returns {Boolean}
     */
    hasCol:function(colKeyOrIndex){
        if(typeof colKeyOrIndex === 'string'){
            var cols = this.getCols();
            for(var x = 0 ; x < cols.length ; x++){
                if(cols[x].key === colKeyOrIndex){
                    return true;
                }
            }
        }
        else if(typeof colKeyOrIndex === 'number'){
            if(this.cols() > 0){
                colKeyOrIndex = Number.parseInt(colKeyOrIndex);
                return colKeyOrIndex >= 0 && colKeyOrIndex < this.cols();
            }
        }
        return false;
    },
    /**
     * Returns the data that is used by the table.
     * @returns {Array} An array of objects that contains all table data.
     */
    getData:function(){
        return this.obj.data;
    },
    /**
     * Returns the number of visible rows.
     * @returns {Number} The number of visible rows.
     */
    visibleRows:function(){
        if(this.t_body.children[0] === this.noDataRow){
            return 0;
        }
        return this.t_body.children.length;
    },
    /**
     * Returns the total number of rows in the table.
     * @returns {Number} The total number of rows in the table.
     */
    rows:function(){
        return this.getData().length;
    },
    /**
     * Returns the number of columns in the table.
     * @returns {Number} The number of columns in the table.
     */
    cols:function(){
        return this.getCols().length;
    },
    /**
     * Returns the number of visible columns.
     * @returns {Number} The number of visible columns.
     */
    visibleCols:function(){
        var count = 0;
        var cols = this.getCols();
        for(var x = 0 ; x < cols.length ; x++){
            if(cols[x].hidden !== true){
                count++;
            }
        }
        return count;
    },
    /**
     * Returns an array of objects. Each object represents a row.
     * @returns {Array} An array of objects. Each object represents a row.
     */
    getCols:function(){
        return this.obj.cols;
    },
    /**
     * Checks if the table has a footer or not.
     * @returns {Boolean} True if has a footer. False otherwise.
     */
    hasFooter:function(){
        if(this.obj['footer'] === true){
            return true;
        }
        return false;
    },
    /**
     * Checks if the table has a header or not.
     * @returns {Boolean} True if has a header. False otherwise.
     */
    hasHeader:function(){
        if(this.obj['header'] === true){
            return true;
        }
        return false;
    },
    /**
     * Returns the ID of the element that will contain the table.
     * @returns {String} The ID of the element that will contain the table.
     */
    getParentHTMLID:function(){
        return this.obj['parent-html-id'];
    },
    /**
     * Checks if the table is appended to HTML element or not.
     * @returns {Boolean} True if it is appended. False otherwise.
     */
    hasParent:function(){
        return this.obj['has-parent'] === true;
    },
    /**
     * Returns an HTML element that represents the whole table along its controls.
     * @returns {HTMLElement}
     */
    toDOMElement:function(){
        return this.container;
    },
    /**
     * Appends the table to its parent. The ID of the parent must set first.
     * @returns {undefined}
     */
    attach:function(){
        if(this.hasParent() !== true){
            var parent = document.getElementById(this.getParentHTMLID());
            if(parent !== null){
                parent.appendChild(this.toDOMElement());
                this.log('DataTable.attach: Updating the property \'has-parent\'.','info');
                this.obj['has-parent'] = true;
            }
            else{
                this.log('DataTable.attach: No element was fount with ID = '+this.getParentHTMLID(),'warning',true);
            }
        }
        else{
            this.log('DataTable.attach: Already appended to element with ID = '+this.getParentHTMLID(),'info',true);
        }
    },
    /**
     * Returns an array that contains all header cells.
     * @returns {Array} An array that contains all header cells.
     */
    getHeaders:function(){
        return this.t_header.children[0].children;
    },
    /**
     * Returns a header cell given column index.
     * @param {Number} colIndex The index of the column.
     * @returns {HTMLElement}
     */
    getHeader:function(colIndex){
        return this.getHeaders()[colIndex];
    },
    /**
     * Returns an array that contains All visible rows of the table.
     * @returns {Array}
     */
    getRows:function(){
        return this.t_body.children;
    },
    /**
     * Returns an array that contains visible columns keys.
     * @returns {Array} An array that contains visible columns keys.
     */
    getVisibleColsKeys:function(){
        var cols = this.getCols();
        var rtVal = [];
        for(var x = 0 ; x < cols.length ; x++){
            if(cols[x].hidden !== true){
                rtVal.push(cols[x].key);
            }
        }
        return rtVal;
    },
    /**
     * Returns an array that contains search columns keys.
     * @returns {Array} An array that contains search columns keys.
     */
    getSearchColsKeys:function(){
        var cols = this.getCols();
        var rtVal = [];
        for(var x = 0 ; x < cols.length ; x++){
            if(cols[x].hidden !== true && cols[x]['search-enabled'] === true){
                rtVal.push(cols[x].key);
            }
        }
        return rtVal;
    },
    /**
     * Returns an array that contains search columns keys.
     * @returns {Array} An array that contains search columns keys.
     */
    getColsKeys:function(){
        var cols = this.getCols();
        var rtVal = [];
        for(var x = 0 ; x < cols.length ; x++){
            rtVal.push(cols[x].key);
        }
        return rtVal;
    },
    /**
     * Sort a column given its number.
     * @param {Number} sourceCol The index of the column.
     * @returns {undefined}
     */
    sort:function(sourceCol){
        this.log('DataTable.sort: Sorting by col number '+sourceCol);
        if(sourceCol >= 0 && sourceCol < this.cols()){
            var sortType = this.updateHeaders(sourceCol);
            this.log('DataTable.sort: Sort Type: '+sortType,'info');
            var dataToSort = extractColData(sourceCol,this.getData(),this.getColsKeys());
            this.log('Datatable.sort: Printing Data that will be sorted','info');
            this.log(dataToSort);
            if(sortType === 'up'){
                var sorted = quickSort(dataToSort,0,dataToSort.length - 1,true);
            }
            else if(sortType === 'down'){
                var sorted = quickSort(dataToSort,0,dataToSort.length - 1,false);
            }
            this.log('Datatable.sort: Printing sorted Data.','info');
            this.log(sorted);
            var colKeys = this.getColsKeys();
            this.log('DataTable.sort: Updating table.','info');
            for(var x = 0 ; x < sorted.length ; x++){
                for(var y = 0 ; y < colKeys.length ; y++){
                    this.set(colKeys[y],x,sorted[x][colKeys[y]]);
                }
            }
            this.log('DataTable.sort: Refreshing table.','info');
            
            this.search_input.oninput();
            this.log('DataTable.sort: Sorting finished.','info');
        }
        else{
            this.log('DataTable.sort: Invalid sort column index: '+sourceCol,'warning');
        }
    },
    /**
     * Update headers after sorting.
     * @param {Number} childToSkip Index of header which was used for sorting.
     * @returns {undefined}
     */
    updateHeaders:function(childToSkip){
        var sortType = 'up';
        for(var x = 0 ; x < this.t_header.children[0].children.length ; x++){
            var cell = this.t_header.children[0].children[x];
            if(cell.attributes.role !== undefined){
                var cellRole = cell.attributes.role.value;
                if(x === childToSkip){
                    if(cellRole === 'sort-up'){
                        sortType = 'up';
                        cell.attributes.role.value = 'sort-down';
                    }
                    else{
                        cell.attributes.role.value = 'sort-up';
                        sortType = 'down';
                    }
                    continue;
                }
                if(this.t_header.children[0].children[x].attributes.role !== undefined){

                    if(cellRole === 'sort-up' || cellRole === 'sort-down'){
                        cell.attributes.role.value = 'sort-button';
                    }
                }
            }
        }
        return sortType;
    }
});

function extractColData(colNum,tableDataArr, colKeys){
    var dataToSort = [];
    for(var x = 0 ; x < tableDataArr.length; x++){
        var copy = Object.assign({},tableDataArr[x]);
        copy.data = tableDataArr[x][colKeys[colNum]];
        dataToSort.push(copy);
    }
    return dataToSort;
}

function strToNum(str){
    var num = Number.parseFloat(str);
    if(!Number.isNaN(num)){
        return num;
    }
    num = 0;
    for(var x = 0 ; x < str.length ; x++){
        var chAsNum = str.charCodeAt(x);
        if(chAsNum >= 48 && chAsNum <= 57){
            chAsNum -= 48;
        }
        num += chAsNum;
    }
    return num;
}
function quickSort(A, lo, hi,ascending=true){
    if(lo < hi){
        if(ascending === true){
            var splitLoc = quickSort_h_1(A, lo, hi);
        }
        else{
            var splitLoc = quickSort_h_2(A, lo, hi);
        }
        A = quickSort(A, lo, splitLoc - 1,ascending);
        A = quickSort(A, splitLoc + 1, hi,ascending);
    }
    return A;
}
function quickSort_h_2(A, lo, hi){
    var pivot = A[hi];
    var wall = lo - 1;
    if(typeof pivot === 'object'){
        if(pivot.data !== undefined){
            for(var current = wall + 1 ; current < hi ; current++){
                var currentObj = A[current];
                if(typeof currentObj === 'object'){
                    if(currentObj.data !== undefined){
                        if(stringCompare(currentObj.data,pivot.data) === 1){
                            wall++;
                            var tmp = A[current];
                            A[current] = A[wall];
                            A[wall] = tmp;
                        }
                    }
                    else{
                        throw new Error('The attribute \'data\' is missing from the object.');
                    }
                }
                else{
                    throw new Error('Dataset must contain objects only.');
                }
            }
        }
        else{
            throw new Error('The attribute \'data\' is missing from the object.');
        }
    }
    else{
        throw new Error('Dataset must contain objects only.');
    }
    wall++;
    var tmp = A[wall];
    A[wall] = pivot;
    A[hi] = tmp;
    return wall;
}
function quickSort_h_1(A, lo, hi){
    var pivot = A[hi];
    var wall = lo - 1;
    if(typeof pivot === 'object'){
        if(pivot.data !== undefined){
            for(var current = wall + 1 ; current < hi ; current++){
                var currentObj = A[current];
                if(typeof currentObj === 'object'){
                    if(currentObj.data !== undefined){
                        if(stringCompare(currentObj.data,pivot.data) === -1){
                            wall++;
                            var tmp = A[current];
                            A[current] = A[wall];
                            A[wall] = tmp;
                        }
                    }
                    else{
                        throw new Error('The attribute \'data\' is missing from the object.');
                    }
                }
                else{
                    throw new Error('Dataset must contain objects only.');
                }
            }
        }
        else{
            throw new Error('The attribute \'data\' is missing from the object.');
        }
    }
    else{
        throw new Error('Dataset must contain objects only.');
    }
    wall++;
    var tmp = A[wall];
    A[wall] = pivot;
    A[hi] = tmp;
    return wall;
}

function updateHeaders(otherHeaders,childToSkip){
    for(var x = 0 ; x < otherHeaders.length ; x++){
        if(x === childToSkip){
            continue;
        }
        var cell = otherHeaders[x];
        if(cell.attributes.role !== undefined){
            var cellRole = cell.attributes.role.value;
            if(cellRole === 'sort-up' || cellRole === 'sort-down'){
                cell.attributes.role.value = 'sort-button';
            }
        }
    }
}
/**
 * Compare two strings.
 * @param {type} str1
 * @param {type} str2
 * @returns {Number} 0 if the two strings are the same. -1 if 
 * the first string is less. 1 if the first string is greater.
 */
function stringCompare(str1,str2){
    if(str1 === undefined){
        console.warn('Parameter 1 (First String) is undefined.');
    }
    if(str2 === undefined){
        console.warn('Parameter 2 (Second String) is undefined.');
    }
    var str1AsNum = Number.parseFloat(str1);
    var str2AsNum = Number.parseFloat(str2);
    if(!Number.isNaN(str1AsNum) && !Number.isNaN(str1AsNum)){
        if(str1AsNum > str2AsNum){
            return 1;
        }
        else if(str1AsNum < str2AsNum){
            return -1;
        }
        else{
            return 0;
        }
    }
    str1 = ''+str1;
    str2 = ''+str2;
    if(str1.length > 0){
        if(str2.length > 0){
            if(str1.length > str2.length){
                var index = 0;
                while(index !== str2.length){
                    if(str1.charCodeAt(index) > str2.charCodeAt(index)){
                        return 1;
                    }
                    else if(str1.charCodeAt(index) < str2.charCodeAt(index)){
                        return -1;
                    }
                    index++;
                }
                return 1;
            }
            else if(str1.length < str2.length){
                var index = 0;
                while(index !== str1.length){
                    if(str1.charCodeAt(index) > str2.charCodeAt(index)){
                        return 1;
                    }
                    else if(str1.charCodeAt(index) < str2.charCodeAt(index)){
                        return -1;
                    }
                    index++;
                }
                return -1;
            }
            else{
                var index = 0;
                while(index !== str1.length){
                    if(str1.charCodeAt(index) > str2.charCodeAt(index)){
                        return 1;
                    }
                    else if(str1.charCodeAt(index) < str2.charCodeAt(index)){
                        return -1;
                    }
                    index++;
                }
                return 0;
            }
        }
    }
    return 0;
}