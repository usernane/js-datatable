function DataTable(o={},cols=[],data=[]){
    this.obj = o;
    if(o['enable-log'] === true){
        this.log('DataTable: Logging mode is enabled.','warning');
    }
    
    this.log('DataTable: Initializing table.','info');
    Object.defineProperties(this,{
        search_input:{
            value:document.createElement('input'),
            enumerable:false
        },
        print_button:{
            value:document.createElement('button'),
            enumerable:false
        },
        search_label:{
            value:document.createElement('label'),
            enumerable:false
        },
        container:{
            value:document.createElement('div'),
            enumerable:false
        },
        rowCountSelect:{
            value:document.createElement('select'),
            enumerable:false
        },
        rowCountSelectLabel:{
            value:document.createElement('label'),
            enumerable:false
        },
        table:{
            value:document.createElement('table'),
            enumerable:false
        },
        col_set:{
            value:document.createElement('colgroup'),
            enumerable:false
        },
        t_controls:{
            value:document.createElement('div'),
            enumerable:false
        },
        t_body:{
            value:document.createElement('tbody'),
            enumerable:false
        },
        t_header:{
            value:document.createElement('thead'),
            enumerable:false
        },
        t_h_row:{
            value:document.createElement('tr'),
            enumerable:false
        },
        t_footer:{
            value:document.createElement('tfoot'),
            enumerable:false
        },
        t_f_row:{
            value:document.createElement('tr'),
            enumerable:false
        },
        noDataRow:{
            value:document.createElement('tr'),
            enumerable:false
        },
        pageNumberContainer:{
            value:document.createElement('div'),
            enumerable:false
        },
        nextPageButton:{
            value:document.createElement('button'),
            enumerable:false
        },
        prevPageButton:{
            value:document.createElement('button'),
            enumerable:false
        },
        numbersContainer:{
            value:document.createElement('div'),
            enumerable:false
        },
        col_select:{
            value:document.createElement('select'),
            enumerable:false
        }
    });
    this.obj.cols = [];
    this.obj.data = [];
    var inst = this;
    this.log('DataTable: Checking if selective search is enabled.','info');
    if(this.obj['selective-search'] === true && this.isSearchEnabled()){
        this.log('DataTable: It is enabled.','info');
        var o = document.createElement('option');
        o.value = 'all';
        o.innerHTML = 'Select Column Name to Search by...';
        o.selected = true;
        this.col_select.appendChild(o);
        this.col_select.onchange = function(){
            if(this.value === 'all'){
                inst.obj['search-col'] = undefined;
            }
            else{
                inst.obj['search-col'] = inst.getColumn(this.value);
            }
        };
    }
    this.log('DataTable: Checking if pagenation is enabled.','info');
    if(this.obj.paginate === true){
        this.log('DataTable: It is enabled.','info');
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
        this.log('DataTable: Initializing adding table contrls.','info');
        this.t_controls.appendChild(this.print_button);
        this.t_controls.appendChild(this.rowCountSelectLabel);
        this.t_controls.appendChild(this.rowCountSelect);
        this.t_controls.appendChild(this.col_select);
        this.rowCountSelect.t = this;
        this.rowCountSelect.onchange = function(){
            this.t.rowCountChanged();
        };
        this.pageNumberContainer.appendChild(this.prevPageButton);
        this.pageNumberContainer.appendChild(this.nextPageButton);
        this.pageNumberContainer.appendChild(this.numbersContainer);
        this.nextPageButton.innerHTML = '&gt;';
        this.prevPageButton.innerHTML = '&lt;';
        this.log('DataTable: Pagination initialization completed.','info');
    }
    else{
        this.log('DataTable: It is disabled.','info');
    }
    this.log('DataTable: Checking if search is enabled.','info');
    if(this.isSearchEnabled()){
        this.log('DataTable: It is enabled.','info');
        this.log('DataTable: Adding search controls to the table.','info');
        this.t_controls.appendChild(this.search_label);
        this.t_controls.appendChild(this.search_input);
    }
    else{
        this.log('DataTable: It is disabled.','info');
    }
    this.log('DataTable: Appending table controls to the top of the table.','info');
    this.container.appendChild(this.t_controls);
    this.table.className = 'datatable';
    this.table.appendChild(this.col_set);
    this.log('DataTable: Checking if table has headers or not.','info');
    if(this.hasHeader()){
        this.log('DataTable: It has headers.','info');
        this.t_header.appendChild(this.t_h_row);
        this.table.appendChild(this.t_header);
    }
    else{
        this.log('DataTable: It has no headers.','info');
    }
    this.table.appendChild(this.t_body);
    this.log('DataTable: Checking if table has footers or not.','info');
    if(this.hasFooter()){
        this.log('DataTable: It has fotters.','info');
        this.t_footer.appendChild(this.t_f_row);
        this.table.appendChild(this.t_footer);
    }
    else{
        this.log('DataTable: It has no fotters.','info');
    }
    this.container.appendChild(this.table);
    if(this.obj.paginate === true){
        this.container.appendChild(this.pageNumberContainer);
    }
    this.log('DataTable: Checking columns.','info');
    var numCol = {
        title:'#',
        width:4,
        key:'row-index',
        type:'number'
    };
    this.addColumn(numCol);
    if(Array.isArray(cols)){
        this.log('DataTable: Adding columns...','info');
        for(var x = 0 ; x < cols.length ; x++){
            this.addColumn(cols[x]);
        }
    }
    else{
        this.log('DataTable: attribute \'cols\' is not an array.','warning');
    }
    this.log('DataTable: Checking initial dataset','info');
    if(Array.isArray(data)){
        this.log('DataTable: Adding data to the table...','info');
        for(var x = 0 ; x < data.length ; x++){
            this.addRow(data[x]);
        }
    }
    else{
        this.log('DataTable: attribute \'data\' is not an arrar.','warning');
    }
    this.pageNumberContainer.className = 'page-controls';
    this.numbersContainer.className = 'page-number-container';
    this.container.className = 'table-container';
    this.t_controls.className = 'datatable-controls';
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
    this.log('DataTable: Initializing NO DATA cell.','info');
    this.noDataRow.appendChild(document.createElement('td'));
    this.noDataRow.children[0].style['text-align'] = 'center';
    this.log('DataTable: Checking language attribute.','info');
    if(typeof this.obj.lang !== 'object'){
        this.log('DataTable: Attribute \'\' is not set. Setting to default.','warning');
        this.obj.lang = {};
    }
    this.setShowSelectLabelText(this.obj.lang['show-label']); 
    this.setNoDataText(this.obj.lang['no-data-label']);
    this.setSearchLabel(this.obj.lang['search-label']);
    this.setPrintLabel(this.obj.lang['print-label']);
    this.setSelectColLabel(this.obj.lang['select-col-label']);
    
    if(this.obj.paginate === true){
        this.rowCountChanged();
    }
    if(this.obj.attach === true){
        this.attach();
    }
    this.log('DataTable: Initializing search event.','warning');
    this.search_input.oninput = function(){
        inst.search(this.value);
    };
    this.print_button.onclick = function(){
        inst.print('rtl');
    };
    this.table.print = function(dir='ltr'){
        var t = document.createElement('table');
        t.innerHTML = this.innerHTML;
        //check for hidden columns and remove them.
        var hiddenCols = 0;
        for(var x = 0 ; x < inst.cols(); x++){
            var col = inst.getColumn(x);
            if(col.printable === false){
                var colGroup = t.children[0].children[col.index - hiddenCols];
                t.children[0].removeChild(colGroup);
                
                if(inst.hasHeader()){
                    var hCell = t.children[1].children[0].children[col.index - hiddenCols];
                    t.children[1].children[0].removeChild(hCell);
                }
                var tBody = t.children[2];
                for(var y = 0 ; y < tBody.children.length ; y++){
                    var cell = tBody.children[y].children[col.index - hiddenCols];
                    tBody.children[y].removeChild(cell);
                }
                
                if(inst.hasFooter()){
                    var fCell = t.children[3].children[0].children[col.index - hiddenCols];
                    t.children[3].children[0].removeChild(fCell);
                }
                hiddenCols++;
            }
        }
        var oHiddFrame = document.createElement("iframe");
        oHiddFrame.name = 'print-frame';
        var css = document.createElement("link");
        var doc = document;
        var wndw = window;
        oHiddFrame.domain = document.domain;
        oHiddFrame.onload = function(){
            css.href = "ext/res/js/datatable/DataTable.css"; 
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
        window.x = oHiddFrame;
        console.log(oHiddFrame);
    };
    //this.rowCountChanged();
    
    this.log('DataTable: Initializing completed.','warning');
}
Object.defineProperty(DataTable,'SUPPORTED_DATATYPES',{
    value:['boolean','string','number']
});
Object.assign(DataTable.prototype,{
    print:function(dir='ltr'){
        this.table.print(dir);
    },
    getActivePage:function(){
        return this.obj.active;
    },
    isSelectiveSearchEnabled:function(){
        return this.obj['selective-search'] === true;
    },
    isSearchEnabled:function(){
        if(this.obj['enable-search'] === true){
            return true;
        }
        return false;
    },
    filteredRows:function(){
        var count = 0;
        for(var x = 0 ; x < this.rows() ; x++){
            if(this.getData()[x].show === undefined || this.getData()[x].show === true){
                count++;
            }
        }
        return count;
    },
    getSearchCol:function(){
        return this.obj['search-col'];
    },
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
    setPrintLabel:function(label){
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
    },
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
    setSearchLabel:function(label){
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
    },
    validateDataState:function(){
        try{
            this.noDataRow.children[0].colSpan = this.cols();
            if(this.visibleRows() === 0){
                this.t_body.appendChild(this.noDataRow);
            }
            else{
                this.t_body.removeChild(this.noDataRow);
            }
        }
        catch(e){}
    },
    rowCountChanged:function(){
        var rowsCount = this.rowsPerPage();
        this.log('DataTable.rowCountChanged: Rows per page: '+rowsCount,'info');
        this.obj.start = 0;
        if(rowsCount > this.filteredRows()){
            this.obj.end = this.filteredRows();
            this.log('DataTable.rowCountChanged: Rows count > '+this.filteredRows(),'info');
        }
        else{
            this.obj.end = rowsCount;
        }
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
        this.validateDataState();
    },
    setShowSelectLabelText:function(label){
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
    },
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
    displayPage:function(){
        this.log('DataTable.displayPage: Removing All Rows.','info');
        while(this.t_body.children.length !== 0){
            this.removeRow(0);
        }
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
    },
    log:function(message,type=''){
        if(this.obj['enable-log'] === true){
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
    pagesCount:function(){
        var totalRows = this.filteredRows();
        var rowsToDisplay = this.rowsPerPage();
        return Math.ceil(totalRows/rowsToDisplay);
    },
    rowsPerPage:function(){
        var count = Number.parseInt(this.rowCountSelect.value);
        return count;
    },
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
                    var colDatatype = this.getColumn(colIndexOrKey).type;
                    this.log('DataTable.set: Validating datatype.','info');
                    if(type === colDatatype){
                        for(var x = 0 ; x < rowsCount ; x++){
                            for(var y = 0 ; y < colsCount ; y++){
                                if(x === row && y === colIndexOrKey){
                                    var colKey = this.getColumn(colIndexOrKey).key;
                                    this.log('DataTable.set: Updating value at column \''+colKey+'\' row \''+row+'\'.','info');
                                    if(type === 'string' || type === 'number'){
                                        this.obj.data[x][colKey] = val;
                                        if(x < this.visibleRows()){
                                            this.t_body.children[x].children[y].innerHTML = val;
                                        }
                                    }
                                    else if(type === 'boolean'){
                                        if(x < this.visibleRows()){
                                            this.t_body.children[x].children[y].children[0].checked = val;
                                        }
                                        this.obj.data[x][colKey] = val;
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
                var type = typeof val;
                var colDatatype = this.getColumn(colIndexOrKey).type;
                if(type === colDatatype){
                    for(var x = 0 ; x < rowsCount ; x++){
                        if(x === row){
                            if(type === 'string' || type === 'number'){
                                this.obj.data[x][colIndexOrKey] = val;
                                if(x < this.visibleRows()){
                                    if(!this.isColumnHidden(colIndexOrKey)){
                                        this.t_body.children[x].children[this.colIndex(colIndexOrKey)].innerHTML = val;
                                    }
                                }
                            }
                            else if(type === 'boolean'){
                                if(x < this.visibleRows()){
                                    if(!this.isColumnHidden(colIndexOrKey)){
                                        this.t_body.children[x].children[this.colIndex(colIndexOrKey)].children[0].checked = val;
                                    }
                                }
                                this.obj.data[x][colIndexOrKey] = val;
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
    setColTitle:function(hNum,val){
        var cols = this.getCols();
        if(cols[hNum] !== undefined){
            cols[hNum].title = val;
            this.t_h_row.children[hNum].innerHTML = val;
            this.t_f_row.children[hNum].innerHTML = val;
        }
    },
    removeRow(rowIndex,removeData=false){
        if(rowIndex < this.rows() && rowIndex >= 0){
            this.t_body.removeChild(this.t_body.children[rowIndex]);
            if(removeData === true){
                this.obj.data.splice(rowIndex,1);
            }
        }
    },
    getColumn:function(colKeyOrIndex){
        if(typeof colKeyOrIndex === 'number'){
            if(colKeyOrIndex >= 0 && colKeyOrIndex < this.cols()){
                return this.obj.cols[colKeyOrIndex];
            }
        }
        else if(typeof colKeyOrIndex === 'string'){
            var cols = this.getCols();
            for(var x = 0 ; x < cols.length ; x++){
                if(cols[x].key === colKeyOrIndex){
                    return cols[x];
                }
            }
        }
        this.log('DataTable.getColumn: Invalid column name or index: '+colKeyOrIndex,'info');
        return undefined;
    },
    getColDataType:function(colIndexOrKey){
        var col = this.getColumn(colIndexOrKey);
        if(col !== undefined){
            return col.type;
        }
        this.log('DataTable.getColDataType: Invalid column name or index: '+colIndexOrKey,'info');
        return undefined;
    },
    getColDefault:function(colKeyOrIndex){
        var col = this.getColumn(colKeyOrIndex);
        if(col !== undefined){
            return col.default;
        }
        this.log('DataTable.getColDefault: No such column: '+colKeyOrIndex+'.','warning');
        return undefined;
    },
    setColDefault:function(colKeyOrIndex,val){
        if(this.hasCol(colKeyOrIndex)){
            var colDataType = this.getColDataType(colKeyOrIndex);
            if(typeof val === colDataType){
                this.getColumn(colKeyOrIndex).default = val;
                return true;
            }
            this.log('DataTable.setColDefault: Column datatype does not match provided value type.','info');
            return false;
        }
        this.log('DataTable.setColDefault: No such column: '+colKeyOrIndex,'info');
        return false;
    },
    addRow:function(data={},storeData=true){
        this.log('DataTable.addRow: Checking if data is an object.','info');
        data.show = true;
        data['row-index'] = this.rowsPerPage() * this.getActivePage() + this.visibleRows() + 1;
        if(typeof data === 'object'){
            this.log('DataTable.addRow: Checking data keys.','info');
            var keys = Object.keys(data);
            var keyIndex = [];
            //first, extract the data that can be inserted.
            for(var x = 0 ; x < keys.length ; x++){
                var index = this.colIndex(keys[x]);
                if(index === -1){
                    this.log('DataTable.addRow: Key \''+keys[x]+'\' is not a column in the table.','warning');
                }
                else{
                    keyIndex.push({key:keys[x],index:index,datatype:this.getColumn(index).type});
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
                    this.log('DataTable.addRow: Key \''+key+'\' has no value. Using default.','info');
                    var dataType = this.getColDataType(key);
                    var index = this.colIndex(key);
                    keyIndex.push({key:key,index:index,datatype:dataType});
                    data[key] = this.getColDefault(key);
                }
            }
            //start adding data
            this.log('DataTable.addRow: Checking if there are values to add.','info');
            if(keyIndex.length !== 0){
                this.log('DataTable.addRow: Creating new row.','info');
                var dataObj = {};
                var row = document.createElement('tr');
                var colCount = this.cols();
                for(var x = 0 ; x < colCount ; x++){
                    var cell = document.createElement('td');
                    for(var y = 0 ; y < keyIndex.length ; y++){
                        var val = data[keyIndex[y].key];
                        dataObj[keyIndex[y].key] = val;
                        if(keyIndex[y].index === x){
                            //check if column is printable or not
                            if(!this.isPrintable(keyIndex[y].key)){
                                cell.className = 'no-print';
                                this.log('DataTable.addRow: The column \''+keyIndex[y].key+'\' is not printable.','info');
                            }
                            //check if column is hidden or not
                            if(this.isColumnHidden(keyIndex[y].key)){
                                cell.className = cell.className+' hidden';
                                this.log('DataTable.addRow: The column \''+keyIndex[y].key+'\' is hidden.','info');
                            }
                            this.log('DataTable.addRow: Creating new cell for col \''+keyIndex[y].key+'\'.','info');
                            this.log('DataTable.addRow: Cell value: \''+val+'\'.','info');
                            var type = typeof val;
                            if(type === keyIndex[y].datatype){
                                if(type === 'string' || type === 'number'){
                                    cell.innerHTML = data[keyIndex[y].key];
                                    dataObj[keyIndex[y].key] = cell.innerHTML;
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
                                        inst.log('Check box value changed to '+this.checked,'info');
//                                            var cell = this.parentElement;
//                                            var child = cell.parentElement;
//                                            var i = 0;
//                                            while((child = child.previousSibling) !== null ){
//                                                i++;
//                                            }
                                        for(var x = 0 ; x < inst.rows() ; x++){
                                            if(inst.getData()[x]['row-index'] === this.row){
                                                inst.log('Updating value at column \''+this.col+'\', row \''+x+'\'.','info');
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
            }
            else{
                this.log('DataTable.add: No row added.','info');
            }
            this.validateDataState();
        }
        else{
            this.log('DataTable.addColumn: The given parameter is not an object.','info');
        }
    },
    isPrintable:function(colKeyOrIndex){
        var col = this.getColumn(colKeyOrIndex);
        if(col !== undefined){
            return col['printable'] !== false;
        }
        return false;
    },
    addColumn:function(col={key:'x',title:'header',sortable:false,width:10,default:'-'}){
        if(typeof col === 'object'){
            if(col.key !== undefined){
                col.key = ''+col.key;
                if(col.key.length > 0){
                    if(!this.hasCol(col.key)){
                        col.index = this.cols();
                        var colSetCol = document.createElement('col');
                        colSetCol.span = '1';
                        if(col.width !== undefined){
                            if(col.width <= 100 && col.width > 0){
                                colSetCol.width = col.width+'%';
                            }
                            else{
                                this.log('DataTable.addColumn: Invalid Column width: '+col.width,'warning');
                            }
                        }
                        else{
                            this.log('DataTable.addColumn: Column width not specifyed.','warning');
                        }
                        this.col_set.appendChild(colSetCol);
                        var hCell = document.createElement('th');
                        if(col.sortable === true){
                            hCell.setAttribute('role','sort-button');
                            hCell.dataTable = this;
                            var colNum = this.getCols().length !== 0 ? this.getCols().length : 0;
                            hCell.onclick = function(){
                                this.dataTable.sort(colNum);
                            };
                        }
                        if(col.title !== undefined){
                            hCell.innerHTML = col.title;
                        }
                        else{
                            hCell.innerHTML = 'Col-'+this.getCols().length;
                            col.title = hCell.innerHTML;
                        }

                        this.t_h_row.appendChild(hCell);
                        var fCell = document.createElement('th');
                        fCell.innerHTML = hCell.innerHTML;
                        if(col.printable === false){
                            colSetCol.className = 'no-print';
                            hCell.className = 'no-print';
                            fCell.className = 'no-print';
                        }
                        if(col.hidden === true){
                            colSetCol.className = colSetCol.className+' hidden';
                            hCell.className = hCell.className+' hidden';
                            fCell.className = fCell.className+' hidden';
                        }
                        this.t_f_row.appendChild(fCell);
                        if(col['search-enabled'] === true){
                            if(this.isSearchEnabled() && this.isSelectiveSearchEnabled()){
                                var o = document.createElement('option');
                                o.innerHTML = col.title;
                                o.value = col.key;
                                this.col_select.appendChild(o);
                            }
                        }
                        if(DataTable.SUPPORTED_DATATYPES.indexOf(col.type) === -1){
                            this.log('DataTable.addColumn: Unsupported datatype: '+col.type+'. Default is used (string)','warning');
                            col.type = 'string';
                            if(col.default !== undefined){
                                col.default = ''+col.default;
                            }
                        }
                        if(col.default === undefined){
                            this.log('DataTable.addColumn: No default value for the column is provided.','warning');
                            if(col.type === 'string'){
                                col.default = '-';
                                this.log('\'-\' is used as default value.','info');
                            }
                            else if(col.type === 'number'){
                                col.default = 0;
                                this.log('\'0\' is used as default value.','info');
                            }
                            else if(col.type === 'boolean'){
                                col.default = false;
                                this.log('\'false\' is used as default value.','info');
                            }
                        }
                        this.obj.cols.push(col);
                        this.validateDataState();
                    }
                    else{
                        this.log('DataTable.addColumn: A column was already added with key = '+col.key,'warning');
                    }
                }
                else{
                    this.log('DataTable.addColumn: Invalid column key: '+col.key,'warning');
                }
            }
            else{
                this.log('DataTable.addColumn: The attribute \'key\' is missing.','warning');
            }
        }
        else{
            this.log('DataTable.addColumn: The given parameter is not an object.','warning');
        }
    },
    colIndex:function(colKey){
        var cols = this.getCols();
        for(var x = 0 ; x < cols.length ; x++){
            if(cols[x].key === colKey){
                return x;
            }
        }
        return -1;
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
    getCols:function(){
        return this.obj.cols;
    },
    hasFooter:function(){
        if(this.obj['footer'] === true){
            return true;
        }
        return false;
    },
    hasHeader:function(){
        if(this.obj['header'] === true){
            return true;
        }
        return false;
    },
    getParentHTMLID:function(){
        return this.obj['parent-html-id'];
    },
    hasParent:function(){
        return this.obj['has-parent'] === true;
    },
    toDOMElement:function(){
        return this.container;
    },
    attach:function(){
        if(this.hasParent() !== true){
            var parent = document.getElementById(this.getParentHTMLID());
            this.log('DataTable.attach: Printing Parent','info');
            this.log(parent);
            if(parent !== null){
                parent.appendChild(this.toDOMElement());
                this.log('DataTable.attach: Updating the property \'has-parent\'.','info');
                this.obj['has-parent'] = true;
            }
            else{
                this.log('DataTable.attach: No element was fount with ID = '+this.getParentHTMLID(),'warning');
            }
        }
        else{
            this.log('DataTable.attach: Already appended to element with ID = '+this.getParentHTMLID(),'info');
        }
    },
    getHeaders:function(){
        return this.t_header.children[0].children;
    },
    getHeader:function(colIndex){
        return this.getHeaders()[colIndex];
    },
    getRows:function(){
        return this.t_body.children;
    },
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
    getColsKeys:function(){
        var cols = this.getCols();
        var rtVal = [];
        for(var x = 0 ; x < cols.length ; x++){
            rtVal.push(cols[x].key);
        }
        return rtVal;
    },
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