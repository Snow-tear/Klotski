let url =
  "https://script.google.com/macros/s/AKfycbwvUkbD3iT6RODq0hg1ZddMhCaWoMP9eZJnE0f6CqY9C2Wc_9aw-4_rXJlfcQYTgzeEJA/exec";

let records = null;

function add_record(name, time, step, 关卡) {
  $.ajax({
    url: url,
    data: { fun: "add_record", name: name, time: time, step: step, 关卡: 关卡 },
    success: response => {
      get_records(show_records);
    },
  });
}

function get_records(recall) {
  $.ajax({
    url: url,
    data: { fun: "get_records" },
    success: response => {
      records = JSON.parse(response);
      recall();
    },
  });
}

function show_records(sort = "time") {
  if (!records) return -1;
  sort_records(records, sort);
  const tbody = document.querySelector("#ranking tbody");
  $("#ranking tr:not(:first)").remove();
  for (let i in records) {
    let tr = document.createElement("tr");
    tbody.appendChild(tr);

    let record = [+i + 1].concat(records[i].slice(0, 3));
    record.push(timestamp_to_date(records[i][3]));

    for (let value of record) {
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
  } else if (sort === "date") {
    records.sort((a, b) => b[3] - a[3]);
    console.log(records);
  }
}

function timestamp_to_date(timestamp) {
  const date = new Date(timestamp); // 参数需要毫秒数，所以这里将秒数乘于 1000
  Y = date.getFullYear() + "-";
  M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  D = date.getDate() + " ";
  h = date.getHours() + ":";
  m = date.getMinutes() + ":";
  s = date.getSeconds();
  return Y + M + D + h + m + s;
}

get_records(show_records);
