function CompareScreen({
  students,
  responses,
  postResponses,
  setScreen,
  resetActivity,
}) {
  const sameIdeas = (a = [], b = []) => {
    if (a.length !== b.length) return false;

    const sortedA = [...a].sort();
    const sortedB = [...b].sort();

    return sortedA.every(
      (item, index) => item === sortedB[index]
    );
  };

  const changedCount = students.filter((student) => {
    const pre = responses.find(
      (r) => r.student === student
    );

    const post = postResponses.find(
      (r) => r.student === student
    );

    if (!pre || !post) return false;

    return !sameIdeas(pre.ideas, post.ideas);
  }).length;

  const sameCount = students.length - changedCount;

  return (
    <div style={{ padding: "30px" }}>
      <h1>เปรียบเทียบก่อนเรียน - หลังเรียน</h1>

      <p>นักเรียนทั้งหมด {students.length} คน</p>
      <p>มีการเปลี่ยนแปลงแนวคิด {changedCount} คน</p>
      <p>คงแนวคิดเดิม {sameCount} คน</p>

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
            <th>นักเรียน</th>
            <th>ก่อนเรียน</th>
            <th>หลังเรียน</th>
            <th>แนวคิดที่เพิ่มขึ้น</th>
            <th>ผลการเปรียบเทียบ</th>
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

            const preIdeas = pre ? pre.ideas : [];
            const postIdeas = post ? post.ideas : [];

            const addedIdeas = postIdeas.filter(
              (idea) => !preIdeas.includes(idea)
            );

            const changed =
              !sameIdeas(preIdeas, postIdeas);

            return (
              <tr key={student}>
                <td>{student}</td>

                <td>
                  {preIdeas.length > 0
                    ? preIdeas.map((idea) => (
                        <div key={idea}>{idea}</div>
                      ))
                    : "-"}
                </td>

                <td>
                  {postIdeas.length > 0
                    ? postIdeas.map((idea) => (
                        <div key={idea}>{idea}</div>
                      ))
                    : "-"}
                </td>

                <td>
                  {addedIdeas.length > 0
                    ? addedIdeas.map((idea) => (
                        <div key={idea}>{idea}</div>
                      ))
                    : "-"}
                </td>

                <td>
                  {changed
                    ? "มีการเปลี่ยนแปลงแนวคิด"
                    : "คงแนวคิดเดิม"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <br />

      <button
        onClick={() => setScreen("brainstorm")}
      >
        กลับ
      </button>

      <button
        onClick={resetActivity}
        style={{
          marginLeft: "10px",
        }}
      >
        สร้างกิจกรรมใหม่
      </button>
    </div>
  );
}

export default CompareScreen;