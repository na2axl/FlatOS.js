function (path) {
    current = panelNB + 1;
    if (typeof path === 'undefined') {
        var opts = {parent_pid: 'flatos_notepad', parent_iid: instance};
        if (typeof file_info[current-1].internalPath != 'undefined') {
            var file = new FlatOS.File(file_info[current-1].internalPath);
            opts.startAt = file.dirname();
        }
        var selector = new FlatOS.System.FileSelectorWindow(opts, function(filepath) {
            var file = new FlatOS.File(filepath);
            file_info[current] = {};
            file_info[current].internalPath = filepath;
            file_info[current].type = file.extension();
            file_info[current].path = file.externalPath();
            file_info[current].name = file.filename();
            file_info[current].size = file.sizeInOctets();

            console.log(current);
            add_panel(file_info[current].name+'.'+file_info[current].type);

            editor[current].setValue(file.read());
            _window.setTitle(file_info[current].path + ' - CodeMaster');
            editor[current].getSession().setUndoManager(new ace.UndoManager());
            if (typeof exts[file_info[current].type] === 'undefined') {
                editor[current].getSession().setMode("ace/mode/text");
            }
            else {
                editor[current].getSession().setMode("ace/mode/"+exts[file_info[current].type]);
            }
            editor[current].focus();
            update_panels('#flatos_notepad_'+instance+'_panel_'+current);
        });
    }
    else {
        var file = new FlatOS.File(path);
        file_info[current] = {};
        file_info[current].internalPath = path;
        file_info[current].type = file.extension();
        file_info[current].path = file.externalPath();
        file_info[current].name = file.filename();
        file_info[current].size = file.sizeInOctets();

        console.log(current);
        add_panel(file_info[current].name+'.'+file_info[current].type);

        editor[current].setValue(file.read());
        _window.setTitle(file_info[current].path + ' - CodeMaster');
        editor[current].getSession().setUndoManager(new ace.UndoManager());
        if (typeof exts[file_info[current].type] === 'undefined') {
            editor[current].getSession().setMode("ace/mode/text");
        }
        else {
            editor[current].getSession().setMode("ace/mode/"+exts[file_info[current].type]);
        }
        editor[current].focus();
        update_panels('#flatos_notepad_'+instance+'_panel_'+current);
    }
}