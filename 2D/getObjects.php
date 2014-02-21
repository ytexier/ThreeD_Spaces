<?php

    $dir = 'assets/models/objects/';
    
    if ($handle = opendir($dir)) {

      $files = array();

      while (false !== ($entry = readdir($handle))) {

        if ($entry != "." && $entry != ".." && is_file($dir . $entry))
            array_push($files, $entry);

      }

      echo json_encode($files);
      closedir($handle);
    }

?>

