const axios = require("axios");
const { load } = require("cheerio");
var xlsx = require("xlsx");


const jobPosts = async()=>{
    try {
        const res = await axios.get("https://www.quikr.com/jobs/it-software-developer+pune+zwqxj284607247",{
            headers: {
                        "content-type": "text/html"
                    }
        });
        const html$ = load(res.data);
        const postsArr = html$(".job-card.apply-block.adImpression-click-event.adImpression-event-class1");
        // console.log(postsArr.length);

        var workbook = xlsx.utils.book_new();
        const vacancy_array = [];

        postsArr.each((_,item)=>{
            const container = html$(item);

            // Title
            const title = container.find("a.job-title").text();
            // console.log(title);

            // salary
            const month_or_year = container.find('.attributeSection [class=" gray-light attributesVal textCaps "]').text();
            const salary = container.find(".perposelSalary.attributeVal").text();

            // Job Type
            const job_type = container.find('.attributeSection [class="attributeVal"]').text();
            // console.log(job_type);

            // company
            const company = container.find('[class="salary col-lg-3 col-md-6 col-xs-6 nopadding"] [class="attributeVal cursor-default"]').text();
            if(company == ""){
                company_name = "Not mentioned";
            }
            else{
                company_name = company;
            }

            // Experience Required
            const experience = container.find('[class="inlineBlock lineH mlAuto"]').text();
            const experience_required = experience.split("Experience")[1];

            // location
            const city = container.find('[class="city"]').text();
            const address = container.find('span [class="gray-light hidden-sm hidden-xs"]').text().split("+")[0];
            const location = city +" "+address;
            // console.log(location);

            // posted on
            const posted_on = container.find('[class="jsPostedOn"]').text();
            // console.log(posted_on);


            vacancy_array.push({
                "Job_Role" : title,
                "Salary" : salary+"("+month_or_year+")",
                "Job_Type" : job_type,
                "Company_Name" : company_name,
                "Experience_Required" : experience_required,
                "Location" : location,
                "Posted_On" : posted_on
            });
        });

        var worksheet = xlsx.utils.json_to_sheet(vacancy_array);
        xlsx.utils.book_append_sheet(workbook, worksheet, "Job-Vacancies");
        xlsx.writeFile(workbook, "Job-Vacancy-list.xlsx");

        console.log("File created suceessfully...");

    } 
    catch (error) {
        console.log("Error : ", error);    
    }
}

jobPosts();