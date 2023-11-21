export default function Curve({ leftId, rightId }: { leftId: string; rightId: string }): JSX.Element {
  let leftPointX = 0
  let leftPointY = 0
  let rightPointX = 0
  let rightPointY = 0
  let minY = 0
  let maxY = 0

  const leftBox = document.getElementById(leftId)
  const leftBoxRect = leftBox?.getBoundingClientRect()

  if (leftBox && leftBox.offsetParent) {
    minY = leftBox.offsetParent.getBoundingClientRect().top
    maxY = leftBox.offsetParent.getBoundingClientRect().bottom
  }

  const rightBox = document.getElementById(rightId)
  const rightBoxRect = rightBox?.getBoundingClientRect()

  if (leftBoxRect && rightBoxRect) {
    leftPointX = leftBoxRect.right
    leftPointY = (leftBoxRect.top + leftBoxRect.bottom) / 2
    if (leftPointY < minY) leftPointY = minY
    if (leftPointY > maxY) leftPointY = maxY
    rightPointX = rightBoxRect.left
    rightPointY = (rightBoxRect.top + rightBoxRect.bottom) / 2
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-teal-600 w-full h-full absolute top-1 left-0">
      <path
        className="fill-none stroke-[3px]"
        d={`
          M ${leftPointX} ${leftPointY}
          Q ${(leftPointX + rightPointX) / 2} ${leftPointY}, ${(leftPointX + rightPointX) / 2}
          ${(leftPointY + rightPointY) / 2}
          Q ${(leftPointX + rightPointX) / 2} ${rightPointY},
          ${rightPointX} ${rightPointY}`}
      />
    </svg>
  )
}
