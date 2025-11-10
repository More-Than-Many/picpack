const path = require("path");
const fs = require("fs");

function delete_files(source_dir) {
  fs.readdir(source_dir, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    files.forEach((file) => {
      var file_path = path.join(source_dir, file);

      fs.unlink(file_path, (unlinkErr) => {
        if (unlinkErr) {
          console.error(`Error deleting file ${file_path}:`, unlinkErr);
        } else {
          console.log(`Deleted: ${file_path}`);
        }
      });
    });
  });
}

function move_files(source_dir, target_dir, target_file) {
  const source_path = path.join(source_dir, target_file);
  const target_path = path.join(target_dir, target_file);
  fs.rename(source_path, target_path, (err) => {
    if (err) {
      console.error("Error moving file", err);
      return;
    }
    console.log("file moved successfully");
  });
}

module.exports.delete_files = delete_files;
module.exports.move_files = move_files;
