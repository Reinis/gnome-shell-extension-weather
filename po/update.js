#! /usr/bin/env gjs

/*
 *
 *  PO Updater for GNOME Shell Extension Weather
 *
 * Copyright (C) 2012
 *     Christian METZLER <neroth@xeked.com>
 *
 *
 * This file is part of gnome-shell-extension-weather.
 *
 * gnome-shell-extension-weather is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * gnome-shell-extension-weather is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with gnome-shell-extension-weather.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

const ByteArray = imports.byteArray;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;

print("Generate gnome-shell-extension-weather.pot");

let cmd = "xgettext -o gnome-shell-extension-weather.pot -L python --from-code=utf-8 --keyword=_ -f POTFILES.in";
let exit_status = null;
let stdout = null;
let stderr = null;
let error = null;

try {
    [exit_status, stdout, stderr, error] = GLib.spawn_command_line_sync(cmd);
    print(ByteArray.toString(stdout));
} catch (error) {
    throw error;
}

if (stderr.length) {
    print(ByteArray.toString(stderr));
} else {
    let file = Gio.file_new_for_path(".");
    let enumerator = file.enumerate_children("standard::name,standard::size", 0, null);
    let linguas = "";
    let fname = "";
    let i = 0;
    let child = enumerator.next_file(null);
    while (child) {
        fname = child.get_name();
        if (fname.search(/.po$/) != -1) {
            print(`Generate ${fname}`);
            linguas += `${fname.split(".po")[0]}\n`;
            cmd = `msgmerge -U ${fname} gnome-shell-extension-weather.pot`;
            try {
                [exit_status, stdout, stderr, error] = GLib.spawn_command_line_sync(cmd);
                print(ByteArray.toString(stderr));
            } catch (error) {
                throw error;
            }
            i++;
        }
        child = enumerator.next_file(null);
    }
    print("Write LINGUAS file");
    file = Gio.file_new_for_path("LINGUAS");
    file.replace_contents(linguas, null, false, Gio.FileCreateFlags.NONE, null);
    print(`Successfully generated ${i} entry`);
}
