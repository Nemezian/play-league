import LastFiveIcon from "./LastFiveIcon"

export default function Standings() {
  return (
    <>
      <h1 class="text-lg text-gray-400 font-medium">2020-21 Season</h1>
      <div class="flex flex-col mt-6">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden sm:rounded-lg">
              <table class="min-w-full text-sm text-gray-400">
                <thead class="bg-gray-800 text-xs uppercase font-medium">
                  <tr>
                    <th></th>
                    <th scope="col" class="px-6 py-3 text-left tracking-wider">
                      Klub
                    </th>
                    <th scope="col" class="px-6 py-3 text-left tracking-wider">
                      MR
                    </th>
                    <th scope="col" class="px-6 py-3 text-left tracking-wider">
                      W
                    </th>
                    <th scope="col" class="px-6 py-3 text-left tracking-wider">
                      R
                    </th>
                    <th scope="col" class="px-6 py-3 text-left tracking-wider">
                      P
                    </th>
                    <th scope="col" class="px-6 py-3 text-left tracking-wider">
                      Pkt
                    </th>
                    <th scope="col" class="px-6 py-3 text-left tracking-wider">
                      Ostatnie 5
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-gray-800">
                  <tr class="bg-black bg-opacity-20">
                    <td class="pl-4">1</td>
                    <td class="flex px-6 py-4 whitespace-nowrap">
                      <img
                        class="w-5"
                        src="https://ssl.gstatic.com/onebox/media/sports/logos/udQ6ns69PctCv143h-GeYw_48x48.png"
                        alt=""
                      />
                      <span class="ml-2 font-medium">Man United</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">17</td>
                    <td class="px-6 py-4 whitespace-nowrap">11</td>
                    <td class="px-6 py-4 whitespace-nowrap">3</td>
                    <td class="px-6 py-4 whitespace-nowrap">3</td>
                    <td class="px-6 py-4 whitespace-nowrap">34</td>
                    <td class="flex px-6 py-4 whitespace-nowrap">
                      <LastFiveIcon type={"win"} />
                      <LastFiveIcon type={"win"} />
                      <LastFiveIcon type={"win"} />
                      <LastFiveIcon type={"draw"} />
                      <LastFiveIcon type={"win"} />
                    </td>
                  </tr>
                  <tr>
                    <td class="pl-4">2</td>
                    <td class="flex px-6 py-4 whitespace-nowrap">
                      <img
                        class="w-5"
                        src="https://ssl.gstatic.com/onebox/media/sports/logos/0iShHhASp5q1SL4JhtwJiw_48x48.png"
                        alt=""
                      />
                      <span class="ml-2 font-medium">Liverpool</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">17</td>
                    <td class="px-6 py-4 whitespace-nowrap">9</td>
                    <td class="px-6 py-4 whitespace-nowrap">6</td>
                    <td class="px-6 py-4 whitespace-nowrap">2</td>
                    <td class="px-6 py-4 whitespace-nowrap">33</td>
                    <td class="flex px-6 py-4 whitespace-nowrap">
                      <LastFiveIcon type={"lose"} />
                      <LastFiveIcon type={"draw"} />
                      <LastFiveIcon type={"draw"} />
                      <LastFiveIcon type={"win"} />
                      <LastFiveIcon type={"win"} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
