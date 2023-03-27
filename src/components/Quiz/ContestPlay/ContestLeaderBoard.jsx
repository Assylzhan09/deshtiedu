import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { withTranslation } from "react-i18next";
import SEO from "../../SEO";
import Breadcrumb from "../../Breadcrumb/Breadcrumb";
import { toast } from "react-toastify";
import { ContestLeaderboardApi } from "../../../store/actions/campaign";
import { contestleaderboard } from "../../../store/reducers/tempDataSlice";
import { useSelector } from "react-redux";
import { imgError } from "../../../utils";

const ContestLeaderBoard = ({ t }) => {

  let getData = useSelector(contestleaderboard);

  const [leaderBoard, setLeaderBoard] = useState({
    myRank: "",
    data: "",
    total: "",
  });

  // let pastcontest = past_id.past_id

  const columns = [
    {
      name: t("Rank"),
      selector: (row) => `${row.user_rank}`,
      sortable: true,
    },
    {
      name: t("Profile"),
      selector: (row) =>
        row.profile ? (
          <div className="leaderboard-profile">
            <img src={row.profile} className="w-100" alt={row.name} onError={imgError}></img>
          </div>
        ) : (
          <div className="leaderboard-profile">
            <img
              src={process.env.PUBLIC_URL + "/images/user.svg"}
              className="w-25"
              alt={row.name}
            ></img>
          </div>
        ),
      sortable: true,
    },
    {
      name: t("Player"),
      selector: (row) => `${row.name}`,
      sortable: true,
    },
    {
      name: t("Score"),
      selector: (row) => `${row.score}`,
    },
  ];

  const getcontestleaderboard = () => {
    ContestLeaderboardApi(getData.past_id, (response) => {
      setTableData(response, response.total);
    }, (error) => {
      toast.error("No Data Found")
      console.log(error)
    })
  }

  const setTableData = (data, total) => {
    setLeaderBoard({ myRank: data.my_rank, data: data.data, total: total });
  };

  useEffect(() => {
    getcontestleaderboard()
  }, []);

  return (
    <React.Fragment>
      <SEO title={t("Contest LeaderBoard")} />
      <Breadcrumb title={t("Contest LeaderBoard")} content={t("Home")} contentTwo={t("Contest LeaderBoard")}/>

      <div className="LeaderBoard">
        <div className="container">
          <div className="row morphisam">
            <div className="table_content mt-3">
              <DataTable
                title=""
                columns={columns}
                data={leaderBoard && leaderBoard.data}
                pagination={false}
                highlightOnHover
                paginationServer
                paginationTotalRows={leaderBoard && leaderBoard.total}
                paginationComponentOptions={{
                  noRowsPerPage: true,
                }}
                className="dt-center"
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default withTranslation()(ContestLeaderBoard);
