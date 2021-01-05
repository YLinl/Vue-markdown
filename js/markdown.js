 
Vue.filter("date",time=>moment(time).format('DD/MM/YY,HH:mm'))
new Vue({
    el:"#notebook",
     data:{
         content:"2",
         notes:JSON.parse(localStorage.getItem('notes'))||[],
         selectedId:localStorage.getItem('selected-id')||null
     },
     methods:{
         saveNotes(notes, oldNotes) {
             console.log('new note:', notes, 'old note', oldNotes);
             localStorage.setItem('notes', JSON.stringify(notes));
             this.reportOperation("saving")
         },
         reportOperation(opName){
             console.log("The", opName, " operation was completed!")
         },
         addNote(){
             const time = Date.now()
             const note = {
                 id:String(time),
                 title:"New note" + (this.notes.length+1),
                 content:"**Hi!** This notebook is using [markdown](https://github.com/adam-p/markdown-here/wiki/Markedown-Cheatsheet) for formatting!",
                 created:time,
                 favorite:false,
             }
             this.notes.push(note);
             this.selectNote(this.notes[this.notes.length-1])
         },
         selectNote(note){
             return this.selectedId=note.id
            
         },
         removeNote(){
             if(this.selectedNote && confirm("Delete the note?")){
                 const index = this.notes.indexOf(this.selectedNote)
                 if(index !==-1){
                     this.notes.splice(index,1)
                 }
             }
         },
         favoriteNote(){
             this.selectedNote.favorite ^=true
         }
     }
     ,
     computed:{
         notePreview(){
            
            return marked(this.selectedNote.content) 
            
         },
         addButtonTitle(){
             return this.notes.length + ' note(s) already'
         },
         selectedNote(){
                 return this.notes.find(note => note.id === this.selectedId)
         },
         sortedNotes(){
             return this.notes.slice().sort((a,b)=>a.created-b.created).sort((a,b)=>
                 (a.favorite===b.favorite)?0:a.favorite?-1:1
             )
       
            
         },
         linesCount(){
             if(this.selectedNote){
                 return this.selectedNote.content.split(/\r\n|\r|\n/).length
             }
         },
         wordsCount(){
             if(this.selectedNote){
                 var s= this.selectedNote.content;
                 s= s.replace(/\n/g,'')
                 s=s.replace(/(^\s*)|(\s*$)/gi,'')
                 s=s.replace(/\s\s+/gi," ")
                 return s.split(' ').length
             }
         },
         charactersCount(){
             if(this.selectedNote){
                 return this.selectedNote.content.split('').length
             }
         }

     },
     watch:{
         notes:{
             handler:"saveNotes",
             deep:true
         },
         selectedId:{
             handler(val){
                 localStorage.setItem('selected-id',val)
             }
         }
     },
     created(){
         this.content=localStorage.getItem("content")|| "You can write in **markdown**"
     }
})
