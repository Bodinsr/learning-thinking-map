function CompareScreen({
  students,
  responses,
  postResponses,
  setScreen,
  resetActivity,
}) {
const changedCount = students.filter(
  (student) => {
    const pre = responses.find(
      (r) => r.student === student
    );

    const post = postResponses.find(
      (r) => r.student === student
    );

    return (
      pre &&
      post &&
      pre.idea !== post.idea
    );
  }
).length;

const sameCount = students.filter(
  (student) => {
    const pre = responses.find(
      (r) => r.student === student
    );

    const post = postResponses.find(
      (r) => r.student === student
    );

    return (
      pre &&
      post &&
      pre.idea === post.idea
    );
  }
).length;
  return (
    <div style={{ padding: "30px" }}>
      <h1>เปรียบเทียบก่อนเรียน - หลังเรียน</h1>
<p>
  👨‍🎓 นักเรียนทั้งหมด {students.length} คน
</p>

<p>
  🔄 เปลี่ยนแนวคิด {changedCount} คน
</p>

<p>
  ✅ คงแนวคิดเดิม {sameCount} คน
</p>
      <table
        border="1"
        cellPadding="10"
        style={{
          borderCollapse: "collapse",
          width: "100%",
        }}
      >
        <thead>
         <tr>
  <th>ชื่อ</th>
  <th>ก่อนเรียน</th>
  <th>หลังเรียน</th>
  <th>ผล</th>
</tr>
        </thead>

        <tbody>
          {students.map((student) => {
            const pre = responses.find(
              (r) => r.student === student
            );

            const post = postResponses.find(
              (r) => r.student === student
            );

            return (
              <tr key={student}>
                <td>{student}</td>

                <td>
                  {pre
                    ? pre.idea
                    : "-"}
                </td>

                <td>
                  {post
                    ? post.idea
                    : "-"}
                </td>
<td>
  {pre && post
    ? pre.idea === post.idea
      ? "✅ คงเดิม"
      : "🔄 เปลี่ยน"
    : "-"}
</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <br />

      <button
        onClick={() =>
          setScreen("brainstorm")
        }
      >
        กลับ
      </button>
<button
  onClick={resetActivity}
  style={{
    marginLeft: "10px",
  }}
>
  🗑 สร้างกิจกรรมใหม่
</button>
    </div>
  );
}

export default CompareScreen;
