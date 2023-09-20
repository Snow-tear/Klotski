let url =
  "https://script.google.com/macros/s/AKfycbxR_K3DpWG6kwB13UIbsyE_QWvNSpeswtX0niQFjMG_tBqLe2S9gZMM8VUKz6nJzlB-HA/exec";

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
      if (response == "成功") {
        console.log("数据添加成功");
      }

      get_records();
    },
  });
}

function get_records() {
  $.ajax({
    url: url,
    data: {
      fun: "get_records",
    },
    success: response => {
      if (response) {
        show_records(JSON.parse(response));
      } else {
        console.log("排行榜数据获取失败");
      }
    },
  });
}

function show_records(records) {
  console.log(records);
  records.sort((a, b) => a[1] - b[1]);
  const table = document.getElementById("ranking");
  table.innerHTML = `
      <tr>
        <td>排名</td>
        <td>昵称</td>
        <td>用时</td>
        <td>步数</td>
      </tr>`;
  let r = 1;
  for (let record of records) {
    let tr = document.createElement("tr");
    table.appendChild(tr);

    let td = document.createElement("td");
    td.innerHTML = r;
    tr.appendChild(td);
    for (let value of record) {
      let td = document.createElement("td");
      td.innerHTML = value;
      tr.appendChild(td);
    }
    r++;
  }
}

get_records();
