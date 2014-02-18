var container = new DThreeSpaces.Container("Museum Test");

      /**
       * set grid visibility depending on option checked or not
       */
      function visibility(){
        console.log("click")
        var radio = d3.selectAll("button[id=floor_button]")
        .each(function(d){ 
          if(d3.select(this).node().checked == true){
            container.setCurrentGrid(this.value);
            container.setVisibleGrid(this.value);
          }else {
            container.setHiddenGrid(this.value);
          }
        });
      }
      
      /**
       * Make a new input radio and its floor(gird) matched
       */
      /**
       * Ajouter bouton avant ?
       */
      function addGrid(){
        console.log("add grid");
        var div = d3.select("div[id=floors]")
        .select("p")
        .append("button")
        .attr({
          type: "button",
          class: "btn btn-xs btn-default",
          name: "button",
          id: "floor_button",
          onClick: "visibility()",
          value: function() {return container.getLength();}
        })
        .text("R" + container.getLength());
        container.addGrid(new DThreeSpaces.Grid());
      }

      function selectItem(item){
        switch(item){
          case "floor":
            resetListModels();
            container.setCurrentItem(item);
            break;
          case "wall":
            resetListModels();
            container.setCurrentItem(item);
            break;
          case "object":
            container.setCurrentItem(item);
            $.post(
              "getModels.php",
              function(data){
                $(data).each( function(i){
                  var div = d3.select("div[id=listModels]")  
                  .append("ul")
                  .append("label")
                  .text(data[i])
                  .append("input")
                  .attr({
                    type: "submit",
                    class: "radioModel",
                    name: "radioModel",
                    value: data[i],
                    onClick:"selectObject(this.value)"
                  });
                });
              },
              'json'
            );
            break;
          default: console.log("no item selected");
        }
      }


      function selectObject(model){
        container.setCurrentObject(model);
      }

      function displayJSON(){
        alert(container.toJson());
      }

      function resetListModels(){
        var div = d3.select("div[id=listModels]")
        .html("");
      }