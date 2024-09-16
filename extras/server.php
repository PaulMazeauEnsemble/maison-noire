<?php

function cors() {
    
  // Allow from any origin
  if (isset($_SERVER['HTTP_ORIGIN'])) {
      // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
      // you want to allow, and if so:
      header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
      header('Access-Control-Allow-Credentials: true');
      header('Access-Control-Max-Age: 86400');    // cache for 1 day
  }
  
  // Access-Control headers are received during OPTIONS requests
  if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
      
      if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
          // may also be using PUT, PATCH, HEAD etc
          header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
      
      if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
          header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
  
      exit(0);
  }
  
}

function fn_readDirectory(){
  if ($handle = opendir(getcwd())) {
      echo "Directory handle: $handle\n";
      echo "Entries:\n";

      /* This is the correct way to loop over the directory. */
      while (false !== ($entry = readdir($handle))) {
          echo "$entry\n";
      }

      /* This is the WRONG way to loop over the directory. */
      while ($entry = readdir($handle)) {
          echo "$entry\n";
      }
      
      closedir($handle);
  }
}

function fn_serveFiles(){
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
  

  // Get the requested file path from the query parameter
  $file = isset($_GET['file']) ? $_GET['file'] : '';
  $file = getcwd() . '/' . $file;
  
  // Serve the requested file
  if (!empty($file) && file_exists($file)) {
      header("Content-Type: " . mime_content_type($file));
      header('Content-Length: ' . filesize($file));
      readfile($file);
  } else {
      http_response_code(404);
  }
  
}


// if(isset($_GET['read'])){
//   fn_readDirectory();
// } else {
//   fn_serveFiles();
// }

fn_serveFiles();



// fn_readDirectory();

// $file = isset($_GET['file']) ? $_GET['file'] : '';

// var_dump( getcwd() );
// var_dump( file_exists(getcwd() . '/' . $file) );
// var_dump( file_exists($file) );