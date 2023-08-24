const http = require("http");
const fs = require("fs");
const express = require("express");
const path = require("path");
let formidable = require("formidable");
const app = express();
const { migrateString } = require('@kosko/migrate');
const { generate } = require('@kosko/generate');
const serviceSave = [];
const ScpuSave = [];
const SmemorySave = [];
const NcpuSave = [];
const NmemorySave = [];

let options ={
    dotfiles : "ignore",
    etag: true,
    extensions: ["htm", "html"],
    index: false,
    maxAge: "7d",
    redirect: false,
    setHeaders: function(res, path, stat){
        res.set("x-timestamp", Date.now());
    }
}
app.use(express.static(__dirname + "/public"));
app.get('/', function(request, response){
    response.sendFile(path.join(__dirname + '/html/index.html'));
})
app.post('/upload', function(request, response){
    let form = new formidable.IncomingForm({
        uploadDir : "./uploads",
    });
    form.parse(request, function (error, fields, files){
        console.log("hi");
        const currentpath = files.yfile[0].filepath
        //console.log(files.yfile[0].filepath);

        fs.rename(currentpath, currentpath + '.yaml', function(){
            response.end("sucessful");
        });
        fs.readFile(currentpath, 'utf8', (err, fileContent) => {
            if (err) {
                console.error(err);
                return;
            }
            var data;
            migrateString(fileContent).then(result => {
                data = result;
                console.log(data); 
                fs.writeFile('./components/deploy.js', data, (error) => {
                    if (error) {
                        console.error('写入文件时出错:', error);
                        return;
                    }
                    console.log('文件写入成功。');
                    
                });
            }).catch(error => {
                console.error(error); 
            });
        });
    })
    response.sendFile(path.join(__dirname + '/html/form.html'));
})

app.post('/DACO', function(request, response){
    let DACOform = new formidable.IncomingForm();
    DACOform.parse(request, function (error, fields, files){
        if(fields.Sname){
            serviceSave.push(fields);
            console.log(serviceSave);
            ScpuSave.push(fields.cpu);
            SmemorySave.push(fields.memory);
            console.log('Service\'s CPU：' + ScpuSave);
            console.log('Service\'s Memory：' + SmemorySave);
        }else{
            serviceSave.push(fields);
            console.log(serviceSave);
            NcpuSave.push(fields.cpu);
            NmemorySave.push(fields.memory);
            console.log('Node\'s CPU：' + NcpuSave);
            console.log('Node\'s Memory：' + NmemorySave);
        }
    })
})
app.get('/generate', function(request, response){
        var data;
        console.log("hello");
        generate("ant").then(result => {
            data = result;
            console.log(data); 
            fs.writeFile('../deploy.yaml', data, (error) => {
                if (error) {
                    console.error('寫入產生时出错:', error);
                    return;
                }
                console.log('檔案產生成功。');
                
            });
        }).catch(error => {
            console.error(error); 
        });
        response.sendFile(path.join(__dirname + '/html/index.html'));
    });
app.listen(8000);
console.log('Server is running at 8000');


