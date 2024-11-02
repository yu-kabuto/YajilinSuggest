import Display from "@/components/display";

export default async function Index() {

  return (
    <>
      <h1>ヤジリンおすすめ問題</h1>
      私が過去にネットで出題したヤジリン(10*10)を収録しました。
      <br/>
      問題の感覚に応じてボタンを押してください。
      <br/>
      たくさん投票すると徐々にあなたのレベルに合った問題になります。
      <br/>
      Solve problems and vote.
      <br/>
      <br/>
      <Display></Display>
    </>
  )
}