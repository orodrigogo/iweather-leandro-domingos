import { mockCityAPIResponse } from "@__tests__/mocks/api/mockCityAPIResponse";
import { mockWeatherAPIResponse } from "@__tests__/mocks/api/mockWeatherAPIResponse";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@__tests__/utils/customRender";
import { saveStorageCity } from "@libs/asyncStorage/cityStorage";
import { Dashboard } from "@screens/Dashboard";
import { api } from "@services/api";

describe("Screen: Dashboard", () => {
  beforeAll(async () => {
    const city = {
      id: "1",
      name: "Curitiba, BR",
      latitude: 123,
      longitude: 321,
    };

    await saveStorageCity(city);

    jest
      .spyOn(api, "get")
      .mockResolvedValueOnce({ data: mockWeatherAPIResponse })
      .mockResolvedValueOnce({ data: mockCityAPIResponse })
      .mockRejectedValueOnce({ data: mockWeatherAPIResponse });
  });
  it("should display the selected city weather", async () => {
    render(<Dashboard />);

    const cityName = await waitFor(() => screen.findByText(/curitiba/i));
    expect(cityName).toBeTruthy();
  });

  it("should show weather when change selected city", async () => {
    render(<Dashboard />);

    await waitForElementToBeRemoved(() => screen.queryByTestId("loading"));

    const cityName = "São Paulo";

    await waitFor(() =>
      act(() => {
        const search = screen.getByTestId("search-input");
        fireEvent.changeText(search, cityName);
      }),
    );

    await waitFor(() =>
      act(() => {
        fireEvent.press(screen.getByText(cityName, { exact: false }));
      }),
    );

    expect(screen.getByText(cityName, { exact: false })).toBeTruthy();
  });
});
