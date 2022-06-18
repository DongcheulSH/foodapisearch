//핵심데이터 작동순서
//2. 이벤트 -> 3. api 호출 -> 4.3. 결과 데이터를 반복문으로 접근 

//1.정적변수
var MAXREAD = 500;
var XNaverClientId = '9yOyQlfPe3SlEctZJoAd';
var XNaverClientSecret = 'yq6pjISiLJ'
var foodsafetykoreaSecret = '3d3a6d20989743e2a185';

//2. 이벤트
//버튼 클릭시 실행되는 부분
document.getElementsByClassName('foodSearchBtn')[0].addEventListener('click', () => {
        try{
            //사용자가 입력한 데이터
            var foodElement = document.getElementsByClassName('foodSearchTxt')[0];
            var foodName = foodElement.value;
            var NotSpfoodName = eliminateSp(foodName);
            checkInput(NotSpfoodName,foodElement);
            foodSearch(NotSpfoodName);
        }catch(e){}
    }
);

//3. api 호출
//naver image search
const foodpictureSearch = async (_foodName) => {
    const response = await fetch("https://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/search/image?sort=sim&display=1&query="+_foodName, {
        headers: new Headers({ 
            "X-Naver-Client-Id": XNaverClientId,
            "X-Naver-Client-Secret": XNaverClientSecret
        })
      });
    if (response.status === 200) {
        var jsonData = await response.json();
        var link = jsonData.items[0].thumbnail;
        var tails = ['.bmp','.rle','.jpg','.gif','.png','.psd','.pdd','.tif','.exif','.raw'];
        var idx;
        for(var tail of tails){
            idx = link.indexOf(tail); 
            if(idx!=-1){
                break;
            }
        }
        var imageLink = link.substring(0, idx+4);
      return imageLink;
    } else {
      throw new Error('Unable to get img source')
    }
  }

//foodsearch api 호출 
function foodSearch(_foodName) {
    console.log("데이터 : "+_foodName);
    fetch("http://openapi.foodsafetykorea.go.kr/api/"+foodsafetykoreaSecret+"/I2790/json/1/10/DESC_KOR="+_foodName)
    .then((response) => { 
        checkApiStatus(response.status);
        return response.json();
    })
    .then((data) => {
        checkfoodApiResult("code",data.I2790.RESULT.CODE , data.I2790.RESULT.MSG);
        checkfoodApiResult(data.I2790.total_count);
        processApiData(data);
        $('.single-item').slick("refresh");
    });
}

//4.유틸리티
//4.1.공백제거 ( 공용 )
function eliminateSp(str){
    var regex = / /gi;
    return str.replace(regex, '');
}
//4.2. 텍스트 비우기 ( 공용 )
function clearTxt(element){
    element.value = "";
    element.focus();
}
//4.3. 결과 데이터를 반복문으로 접근
async function processApiData(foodApiSet){
    var dataSet = foodApiSet.I2790.row;
    var keySet = ["NUTR_CONT1","NUTR_CONT2","DESC_KOR","MAKER_NAME","SUB_REF_NAME"];
    var kindSet = ["열량(kcal)","탄수화물(g)","식품이름","제조사명","자료출처('년도)"];
    var parent = initTag("single-item");
    var slideIndex = 0;
    for (data of dataSet){
        slideIndex++;
        $('.single-item').slick('slickAdd',createTag(data,keySet,kindSet));
    }
}
//4.4 태그 초기화
function initTag(parentClass) {
    var parent = document.getElementsByClassName(parentClass)[0];
    var elementLength = (document.getElementsByClassName('foodElement').length - 1) /2;
    var slideIndex = elementLength;
    while(slideIndex!=0){
        $('.single-item').slick('slickRemove',slideIndex - 1);
        if (slideIndex !== 0){
          slideIndex--;
        }
    }

    return parent;
}
//4.5. 데이터를 받아서 태그생성 < 내부 반복문은 keySet 크기만큼 활동 > + api 사진 합치기
function createTag(data , keySet , kindSet){   
    var childTag = document.createElement('div');
    childTag.setAttribute('class','foodElement');
    childTag.innerHTML = '1회 제공량 기준('+data['SERVING_SIZE']+')<br>'
    foodpictureSearch(data[keySet[2]]).then(
        foodLink => 
        childTag.innerHTML += ('<img class="foodimg" src="'+foodLink+'" alt="'+data[keySet[2]]+'">')
    );
    for (var idx=0 ; idx < keySet.length ; idx++){
        childTag.innerHTML += ( kindSet[idx] + ' : ' + data[keySet[idx]] + '<br>' );
    }
    return childTag;
}
//5.오류 출력
//5.1텍스트 인풋검사 ( 공용 )
function checkInput(str,element){
    if(str.length == 0 ){
        console.log(" 검색 하실 값을 입력해주세요 :) ");
        alert(" 검색 하실 값을 입력해주세요 :) ");
        clearTxt(element);
        throw "exit";
    }
}
//5.2 HttpStatus 검사 ( 공용 )
function checkApiStatus(status){
    if(status!=200){
        console.log("서버 오류 입니다.\n잠시 후에 다시 시도해주세요.");
        alert("서버 오류 입니다.\n잠시 후에 다시 시도해주세요.");
        throw "exit";
    }
}
//5.3결과 데이터 검사
//1) api 결과 코드와 메세지로 검사
function checkfoodApiResult(cd,msg){
    if (cd != "INFO-000") { // 정상 값이 아니라면
        console.log("에러코드 : " + cd + "\n메세지 : " + msg);
        alert(msg);
        throw "exit";
    }
    else {
        console.log(msg);
    }
}
//2) api 결과 값 갯수와 정적변수 비교 검사
function checkfoodApiResult(totalCnt){
    if(totalCnt >= MAXREAD){
        console.log("좀 더 정확한 데이터를 입력해주세요 :)");
        alert("좀 더 정확한 데이터를 입력해주세요 :)");
        throw "exit";
    }
    if(totalCnt == 0 ){
        console.log("일치하는 값이 없습니다 :)");
        alert("일치하는 값이 없습니다 :)");
        throw "exit";
    }
}