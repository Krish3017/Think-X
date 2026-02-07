from src.utils.file_handler import extract_project_count


def test_basic_project_count():
    """Test basic project counting with Tech Stack markers"""
    test_resume = """
Projects
Tech Stack: Python, Flask
Description: Built a web application

Tech Stack: React, TypeScript
Description: Frontend dashboard

Tech Stack: Java, Spring Boot
Description: Microservices API

Experience
Senior Developer at Company X
    """
    count = extract_project_count(test_resume)
    assert count == 3, f"Expected 3 projects, got {count}"
    print("✅ test_basic_project_count PASSED")


def test_no_projects_section():
    """Test resume without Projects section"""
    test_resume = """
Experience
Senior Developer at Company X

Education
BS Computer Science
    """
    count = extract_project_count(test_resume)
    assert count == 0, f"Expected 0 projects, got {count}"
    print("✅ test_no_projects_section PASSED")


def test_projects_section_with_no_tech_stack():
    """Test Projects section without Tech Stack markers"""
    test_resume = """
Projects
Built a web application
Created mobile app

Experience
Senior Developer
    """
    count = extract_project_count(test_resume)
    assert count == 0, f"Expected 0 projects (no tech stack markers), got {count}"
    print("✅ test_projects_section_with_no_tech_stack PASSED")


def test_academic_projects_header():
    """Test with 'Academic Projects' header"""
    test_resume = """
Academic Projects
Tech Stack: Python, Django
Project 1 description

Tech Stack: Node.js, Express
Project 2 description

Skills
JavaScript, Python
    """
    count = extract_project_count(test_resume)
    assert count == 2, f"Expected 2 projects, got {count}"
    print("✅ test_academic_projects_header PASSED")


def test_personal_projects_header():
    """Test with 'Personal Projects' header"""
    test_resume = """
Personal Projects
Tech Stack: React, Redux
Portfolio website

Education
BS Computer Science
    """
    count = extract_project_count(test_resume)
    assert count == 1, f"Expected 1 project, got {count}"
    print("✅ test_personal_projects_header PASSED")


def test_empty_projects_section():
    """Test Projects section with no content"""
    test_resume = """
Projects

Experience
Senior Developer
    """
    count = extract_project_count(test_resume)
    assert count == 0, f"Expected 0 projects, got {count}"
    print("✅ test_empty_projects_section PASSED")


if __name__ == "__main__":
    print("Running project count extraction tests...\n")

    test_basic_project_count()
    test_no_projects_section()
    test_projects_section_with_no_tech_stack()
    test_academic_projects_header()
    test_personal_projects_header()
    test_empty_projects_section()

    print("\n🎉 All tests PASSED!")
