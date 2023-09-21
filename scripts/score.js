let url =
  "https://script.google.com/macros/s/AKfycbxR_K3DpWG6kwB13UIbsyE_QWvNSpeswtX0niQFjMG_tBqLe2S9gZMM8VUKz6nJzlB-HA/exec";

let records = null;

function add_record(name, time, step) {
  $.ajax({
    url: url,
    data: {
      fun: "add_record",
      name: name,
      time: time,
      step: step,
    },
    success: response => {
      get_records(show_records);
    },
  });
}

function get_records(recall) {
  $.ajax({
    url: url,
    data: {
      fun: "get_records",
    },
    success: response => {
      records = JSON.parse(response);
      recall();
    },
  });
}

function show_records(sort = "time") {
  if (!records) return -1;
  sort_records(records, sort);
  const table = document.getElementById("ranking");
  $("#ranking tr:not(:first)").remove();
  for (let i in records) {
    let tr = document.createElement("tr");
    table.appendChild(tr);
    let td = document.createElement("td");
    td.innerHTML = +i + 1;
    tr.appendChild(td);
    for (let value of records[i]) {
      let td = document.createElement("td");
      td.innerHTML = value;
      tr.appendChild(td);
    }
  }
}

function sort_records(records, sort) {
  if (sort === "name") {
    records.sort((a, b) => {
      const [name1, name2] = [a[0], b[0]];
      if (name1 > name2) return 1;
      if (name2 > name1) return -1;
      return 0;
    });
  } else if (sort === "time") {
    records.sort((a, b) => a[1] - b[1]);
  } else if (sort === "step") {
    records.sort((a, b) => a[2] - b[2]);
    console.log(records);
  }
}
get_records(show_records);
